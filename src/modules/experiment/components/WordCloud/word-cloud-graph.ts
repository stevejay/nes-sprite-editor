import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import { includes, cloneDeep, clamp } from "lodash";
import { WordCloudNode } from "./types";
import { GetOrSet } from "../NetworkGraph/types";

export interface IWordCloudGraph {
  (
    nodes: Array<WordCloudNode>,
    selectedIds: Array<WordCloudNode["id"]>,
    recalculateNodes: boolean
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
  toggleNodeCallback(value: (value: WordCloudNode) => void): this;
}

export default function wordCloudGraph(): IWordCloudGraph {
  let containerElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  let onShowTooltip:
    | ((data: WordCloudNode, target: ClientRect) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: WordCloudNode) => void) | null = null;
  let _version = 0;
  let _nodes: Array<WordCloudNode> = [];
  let _bounds: any = null;

  async function renderer(
    nodes: Array<WordCloudNode>,
    selectedIds: Array<WordCloudNode["id"]>,
    recalculateNodes: boolean
  ) {
    if (recalculateNodes) {
      // console.log("RECALCULATING NODES", width, height);
      _version = Date.now();

      const result = await new Promise<{
        version: number;
        items: any;
        bounds: any;
      }>(resolve => {
        const version = _version;

        const fontSize = d3.scaleLog().range([10, 32]);
        if (nodes.length) {
          fontSize.domain([+nodes[nodes.length - 1].value, +nodes[0].value]);
        }

        d3Cloud()
          .stop()
          .size([width, height])
          .words(cloneDeep(nodes))
          .padding(2.5)
          .rotate(0)
          .spiral("rectangular")
          .font("sans-serif")
          .fontSize(d => fontSize(d.value))
          .on("end", (items, bounds) => {
            resolve({ version, items, bounds });
          })
          // .timeInterval(10)
          .start();
      });

      if (result.version !== _version) {
        return;
      }

      _nodes = result.items as Array<WordCloudNode>;
      _bounds = result.bounds;
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
      opacity.domain([+_nodes[_nodes.length - 1].value, +_nodes[0].value]);
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
      .attr(
        "transform",
        d =>
          "translate(" + [width * 0.5, height * 0.5] + ") scale(" + scale + ")"
      );

    let words = wordsGroup.selectAll("text").data(_nodes, node => node.id);
    words
      .exit()
      .transition()
      .duration(500)
      // .style("font-size", "10px")
      .style("opacity", 1e-6)
      .remove();
    words = words
      .enter()
      .append("text")
      .text(d => d.text)
      .attr("text-anchor", "middle")
      .classed("word", true)
      .style("opacity", 1e-6)
      // .style("font-size", "10px")
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("transform", d => "translate(" + [d.x, d.y] + ")")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      .merge(words);
    words
      .classed("selected", d => !!includes(selectedIds, d.id))
      .style("font-size", d => d.size + "px")
      .transition()
      .duration(500)
      .style("opacity", d =>
        !!includes(selectedIds, d.id) ? 1 : opacity(+d.value)
      )
      // .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("transform", d => "translate(" + [d.x, d.y] + ")");

    function handleMouseOver(d: WordCloudNode) {
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: WordCloudNode) {
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: WordCloudNode) {
      onToggleNode && onToggleNode(d);
    }
  }

  renderer.containerElement = function(element: SVGSVGElement) {
    containerElement = element;
    return renderer;
  };

  renderer.width = ((value?: number): number | IWordCloudGraph => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, IWordCloudGraph>;

  renderer.height = ((value?: number): number | IWordCloudGraph => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return renderer;
    }
    return height;
  }) as GetOrSet<number, IWordCloudGraph>;

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

  renderer.toggleNodeCallback = function(value: (data: WordCloudNode) => void) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}
