import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import {
  includes,
  cloneDeep,
  clamp,
  findIndex,
  concat,
  isNil,
  minBy,
  maxBy
} from "lodash";
import { WordCloudNode } from "../WordCloud/types";
import { GetOrSet } from "../NetworkGraph/types";
import { range } from "d3";

const EXPANDER_WIDTH = 45;
const EXPANDER_MARGIN_VERTICAL = 25;
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 32;
const SHRUNK_WORD_CLOUD_WIDTH = 275;

function generateExpanderData(visible: boolean, width: number, height: number) {
  if (!visible) {
    return [];
  }
  return range(0, 5).map(index => {
    return {
      key: index,
      source: { x: SHRUNK_WORD_CLOUD_WIDTH, y: height * 0.5 },
      target: {
        x: SHRUNK_WORD_CLOUD_WIDTH + EXPANDER_WIDTH,
        y:
          EXPANDER_MARGIN_VERTICAL +
          ((height - EXPANDER_MARGIN_VERTICAL * 2) / 4) * index
      }
    };
  });
}

export interface ICooccurrenceWordCloudGraph {
  (
    nodes: Array<WordCloudNode>,
    withNodes: Array<WordCloudNode>,
    sourceNodeId: WordCloudNode["id"] | null,
    withNodeIds: Array<WordCloudNode["id"]>,
    recalculateNodes: boolean,
    recalculateWithNodes: boolean
  ): void;

  containerElement(element: SVGSVGElement): this;

  width(): number;
  width(value: number): this;

  height(): number;
  height(value: number): this;

  showTooltipCallback(
    value: (value: WordCloudNode, target: ClientRect) => void
  ): this;
  hideTooltipCallback(value: () => void): this;
  toggleSourceNodeCallback(value: (value: WordCloudNode) => void): this;
  toggleWithNodeCallback(value: (value: WordCloudNode) => void): this;
}

export default function cooccurrenceWordCloudGraph(): ICooccurrenceWordCloudGraph {
  let containerElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  let onShowTooltip:
    | ((data: WordCloudNode, target: ClientRect) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleSourceNode: ((data: WordCloudNode) => void) | null = null;
  let onToggleWithNode: ((data: WordCloudNode) => void) | null = null;
  let _version = 0;
  let _withVersion = 0;
  let _nodes: Array<WordCloudNode> = [];
  let _withNodes: Array<WordCloudNode> = [];
  let _bounds: any = null;
  let _withBounds: any = null;
  const _linkHorizontal = d3
    .linkHorizontal()
    .x(d => d.x)
    .y(d => d.y);

  async function renderer(
    nodes: Array<WordCloudNode>,
    withNodes: Array<WordCloudNode>,
    sourceNodeId: WordCloudNode["id"] | null,
    withNodeIds: Array<WordCloudNode["id"]>,
    recalculateNodes: boolean,
    recalculateWithNodes: boolean
  ) {
    if (recalculateNodes) {
      _version = Date.now();

      let words = cloneDeep(nodes);
      if (!isNil(sourceNodeId)) {
        const matchIndex = findIndex(words, word => word.id === sourceNodeId);
        if (matchIndex > -1) {
          const wordMatch = words[matchIndex];
          words = concat(
            [wordMatch],
            words.filter((_word, index) => index !== matchIndex)
          );
        }
      }

      const result = await new Promise<{
        version: number;
        items: any;
        bounds: any;
      }>(resolve => {
        const version = _version;

        const fontSize = d3.scaleLog().range([MIN_FONT_SIZE, MAX_FONT_SIZE]);
        if (nodes.length) {
          fontSize.domain([+nodes[nodes.length - 1].value, +nodes[0].value]);
        }

        d3Cloud()
          .stop()
          .size([isNil(sourceNodeId) ? width : SHRUNK_WORD_CLOUD_WIDTH, height])
          .words(words)
          .padding(2.5)
          .rotate(0)
          .spiral("rectangular")
          .font("sans-serif")
          .fontSize(d =>
            d.id === sourceNodeId ? MAX_FONT_SIZE : fontSize(d.value)
          )
          .on("end", (items, bounds) => {
            resolve({ version, items, bounds });
          })
          .start();
      });

      if (result.version === _version) {
        _nodes = result.items as Array<WordCloudNode>;
        _bounds = result.bounds;
      }
    }

    if (recalculateWithNodes) {
      _withVersion = Date.now();
      let withWords = cloneDeep(withNodes);

      const result = await new Promise<{
        version: number;
        items: any;
        bounds: any;
      }>(resolve => {
        const version = _withVersion;
        const fontSize = d3.scaleLog().range([MIN_FONT_SIZE, MAX_FONT_SIZE]);
        if (withWords.length) {
          fontSize.domain([
            +withWords[withWords.length - 1].value,
            +withWords[0].value
          ]);
        }

        d3Cloud()
          .stop()
          .size([SHRUNK_WORD_CLOUD_WIDTH, height])
          .words(withWords)
          .padding(2.5)
          .rotate(0)
          .spiral("rectangular")
          .font("sans-serif")
          .fontSize(d => fontSize(d.value))
          .on("end", (items, bounds) => {
            resolve({ version, items, bounds });
          })
          .start();
      });

      if (result.version === _withVersion) {
        _withNodes = result.items as Array<WordCloudNode>;
        _withBounds = result.bounds;
      }
    }

    const container = d3.select(containerElement);
    container.attr("width", width);
    container.attr("height", height);

    const scale = _bounds
      ? Math.min(
          width / Math.abs(_bounds[1].x - width / 2),
          width / Math.abs(_bounds[0].x - width / 2),
          height / Math.abs(_bounds[1].y - height / 2),
          height / Math.abs(_bounds[0].y - height / 2)
        ) / 2
      : 1;

    const opacity = d3.scaleLog().range([0.5, 1.0]);
    if (_nodes.length) {
      const minNode = minBy(_nodes, node => node.value);
      const maxNode = maxBy(_nodes, node => node.value);
      opacity.domain([
        minNode ? minNode.value : 0,
        maxNode ? maxNode.value : 0
      ]);
    }

    // create a group to contain all the text elements
    let wordsGroup = container.selectAll(".words-group").data([null]);
    wordsGroup = wordsGroup
      .enter()
      .append("g")
      .classed("words-group", true)
      .attr(
        "transform",
        "translate(" + [width * 0.5, height * 0.5] + ") scale(" + scale + ")"
      )
      // @ts-ignore
      .merge(wordsGroup);
    wordsGroup
      .transition()
      .duration(500)
      .attr("transform", d =>
        !isNil(sourceNodeId)
          ? "translate(" +
            [SHRUNK_WORD_CLOUD_WIDTH * 0.5, height * 0.5] +
            ") scale(" +
            scale +
            ")"
          : "translate(" +
            [width * 0.5, height * 0.5] +
            ") scale(" +
            scale +
            ")"
      );

    let words = wordsGroup.selectAll("text").data(_nodes, node => node.id);
    words
      .exit()
      .transition()
      .duration(500)
      .attr("transform", d => "translate(" + [0, 0] + ")")
      .style("opacity", 1e-6)
      .remove();
    words = words
      .enter()
      .append("text")
      .text(d => d.text)
      .attr("text-anchor", "middle")
      .classed("word", true)
      .style("opacity", 1e-6)
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("transform", d => "translate(" + [0, 0] + ")")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleSourceNodeClick)
      .merge(words);
    words
      .classed("selected", d => d.id === sourceNodeId)
      .transition()
      .duration(500)
      .style("opacity", d => (d.id === sourceNodeId ? 1 : opacity(+d.value)))
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("transform", d => "translate(" + [d.x, d.y] + ")");

    const expander = container
      .selectAll("path")
      .data(
        generateExpanderData(!isNil(sourceNodeId), width, height),
        d => d.key
      );
    expander
      .exit()
      .transition()
      .duration(500)
      .style("opacity", 1e-6)
      .remove();
    expander
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("d", _linkHorizontal)
      .style("opacity", 1e-6)
      .transition()
      .duration(500)
      .style("opacity", 1);
    expander.attr("d", _linkHorizontal);

    // +++++++++++++++++++++++++++++++++++++++++++++++

    const withOpacity = d3.scaleLog().range([0.5, 1.0]);
    if (_withNodes.length) {
      const minNode = minBy(_withNodes, node => node.value);
      const maxNode = maxBy(_withNodes, node => node.value);
      withOpacity.domain([
        minNode ? minNode.value : 0,
        maxNode ? maxNode.value : 0
      ]);
    }

    // create a group to contain all the text elements
    let withGroup = container.selectAll(".with-group").data([null]);
    withGroup = withGroup
      .enter()
      .append("g")
      .classed("with-group", true)
      .attr(
        "transform",
        "translate(" + [width, height * 0.5] + ")" // scale(" + scale + ")"
      )
      // @ts-ignore
      .merge(withGroup);
    withGroup
      .transition()
      .duration(500)
      .attr(
        "transform",
        d =>
          !isNil(sourceNodeId)
            ? "translate(" +
              [
                SHRUNK_WORD_CLOUD_WIDTH +
                  EXPANDER_WIDTH +
                  SHRUNK_WORD_CLOUD_WIDTH * 0.5,
                height * 0.5
              ] +
              ")" // scale(" + scale + ")"
            : "translate(" + [width, height * 0.5] + ")" // scale(" + scale + ")"
      );

    let withWords = withGroup
      .selectAll("text")
      .data(_withNodes, node => node.id);
    withWords
      .exit()
      .transition()
      .duration(500)
      .attr("transform", d => "translate(" + [0, 0] + ")")
      .style("opacity", 1e-6)
      .remove();
    withWords = withWords
      .enter()
      .append("text")
      .text(d => d.text)
      .attr("text-anchor", "middle")
      .classed("word", true)
      .style("opacity", 1e-6)
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("transform", d => "translate(" + [0, 0] + ")")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleWithNodeClick)
      .merge(withWords);
    withWords
      // .classed("selected", d => d.id === sourceNodeId)
      .transition()
      .duration(500)
      .style("opacity", d =>
        d.id === sourceNodeId ? 1 : withOpacity(+d.value)
      )
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("transform", d => "translate(" + [d.x, d.y] + ")");

    // +++++++++++++++++++++++++++++++++++++++++++++++

    function handleMouseOver(d: WordCloudNode) {
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: WordCloudNode) {
      onHideTooltip && onHideTooltip();
    }

    function handleSourceNodeClick(d: WordCloudNode) {
      onToggleSourceNode && onToggleSourceNode(d);
    }

    function handleWithNodeClick(d: WordCloudNode) {
      onToggleWithNode && onToggleWithNode(d);
    }
  }

  renderer.containerElement = function(element: SVGSVGElement) {
    containerElement = element;
    return renderer;
  };

  renderer.width = ((value?: number): number | ICooccurrenceWordCloudGraph => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, ICooccurrenceWordCloudGraph>;

  renderer.height = ((value?: number): number | ICooccurrenceWordCloudGraph => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return renderer;
    }
    return height;
  }) as GetOrSet<number, ICooccurrenceWordCloudGraph>;

  renderer.showTooltipCallback = function(
    value: (data: WordCloudNode, target: ClientRect) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(value: () => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleSourceNodeCallback = function(
    value: (data: WordCloudNode) => void
  ) {
    onToggleSourceNode = value;
    return renderer;
  };

  renderer.toggleWithNodeCallback = function(
    value: (data: WordCloudNode) => void
  ) {
    onToggleWithNode = value;
    return renderer;
  };

  return renderer;
}
