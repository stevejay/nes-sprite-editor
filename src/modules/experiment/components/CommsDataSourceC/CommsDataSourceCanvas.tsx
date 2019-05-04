import React from "react";
import * as d3 from "d3";
import styles from "./CommsDataSourceCanvas.module.scss";
import { CommsSourceNode, Margin } from "./types";
import { TooltipData } from "../Tooltip";
import { isNil, includes, uniqBy, sortBy, max } from "lodash";
import generateColor from "../WordCloudCanvasChart/generate-color";

const DURATION_MS = 250;
const MIN_CIRCLE_RADIUS_PX = 5;
const MAX_CIRCLE_RADIUS_PX = 14;
const ARC = 2 * Math.PI;

type Props = {
  width: number;
  height: number;
  margin: Margin | null;
  nodes: Array<CommsSourceNode>;
  selectedNodeIds: Array<CommsSourceNode["id"]>;
  onShowTooltip: (node: CommsSourceNode, target: TooltipData["target"]) => void;
  onHideTooltip: () => void;
  onToggleNode: (node: CommsSourceNode) => void;
};

type ColorNode = HTMLElement & { __data__: CommsSourceNode };

class CommsDataSourceCanvas extends React.Component<Props> {
  _canvas: React.RefObject<HTMLCanvasElement>;
  _hitCanvas: React.RefObject<HTMLCanvasElement>;
  _mounted: boolean;
  _customBase: HTMLElement;
  _timer: d3.Timer | null;
  _colorToNodeMap: { [key: string]: ColorNode };

  constructor(props: Props) {
    super(props);
    this._canvas = React.createRef();
    this._hitCanvas = React.createRef();
    this._mounted = true;
    this.state = { d3Nodes: [], bounds: [], dataVersion: 0 };
    this._customBase = document.createElement("custom");
    this._timer = null;
    this._colorToNodeMap = {};
  }

  componentDidMount() {
    const { width, height, margin } = this.props;
    this.resizeCanvas(this._canvas.current!, width, height);
    this.resizeCanvas(this._hitCanvas.current!, width, height);
    if (!(width > 0) || !(height > 0) || isNil(margin)) {
      return;
    }
    this.drawWithAnimation();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.selectedNodeIds !== this.props.selectedNodeIds ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.margin !== this.props.margin
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { width, height, margin, nodes, selectedNodeIds } = this.props;
    if (!(width > 0) || !(height > 0) || isNil(margin)) {
      return;
    }

    const dimensionsChanged =
      width !== prevProps.width || height !== prevProps.height;
    const marginChanged = margin !== prevProps.margin;
    const nodesChanged = nodes !== prevProps.nodes;
    const selectedNodesChanged = selectedNodeIds !== prevProps.selectedNodeIds;

    if (marginChanged || dimensionsChanged) {
      this.resizeCanvas(this._canvas.current!, width, height);
      this.resizeCanvas(this._hitCanvas.current!, width, height);
    }

    if (marginChanged || nodesChanged || selectedNodesChanged) {
      this.drawWithAnimation();
    } else if (dimensionsChanged) {
      this.draw();
      this.drawHit();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this._timer) {
      this._timer.stop();
    }
    this._timer = null;
  }

  private drawWithAnimation() {
    if (this._timer) {
      this._timer.stop();
    }

    this.dataBind();

    this._timer = d3.timer((elapsed: number) => {
      this.draw();
      if (elapsed > DURATION_MS) {
        if (this._timer) {
          this._timer.stop();
        }
        this.drawHit();
      }
    });
  }

  private dataBind() {
    const { nodes, margin, width, height } = this.props;
    const custom = d3.select(this._customBase);
    const colorToNodeMap = this._colorToNodeMap;

    const uniqueSources = sortBy(
      uniqBy(nodes, source => source.sourceId),
      node => node.sourceName
    );

    const maxXValue = max(nodes.map(node => node.value)) || 1;

    const y = d3
      .scaleBand()
      .domain(uniqueSources.map(d => d.sourceName))
      .range([margin!.top, height - margin!.bottom]);

    const x = d3
      .scaleLinear()
      .domain([0, maxXValue])
      .nice()
      .range([
        MIN_CIRCLE_RADIUS_PX,
        width -
          margin!.right -
          margin!.left -
          MIN_CIRCLE_RADIUS_PX -
          MAX_CIRCLE_RADIUS_PX
      ]);

    const circleRadius = d3
      .scaleLinear()
      .domain([0, maxXValue])
      .range([MIN_CIRCLE_RADIUS_PX, MAX_CIRCLE_RADIUS_PX]);

    let join = custom
      .selectAll<HTMLElement, CommsSourceNode>("custom.word")
      .data(this.props.nodes, d => d.id);

    join
      .exit()
      .each((_d, i, nodes) => {
        const key = d3.select(nodes[i]).attr("hitColor");
        delete colorToNodeMap[key];
      })
      // .transition()
      // .duration(DURATION_MS)
      // .attr("r", 0)
      .remove();

    const enterSelection = join
      .enter()
      .append("custom")
      .attr("class", "word")
      .attr("r", 0)
      .attr("cx", d => x(d.value) + margin!.left + 5)
      .attr(
        "cy",
        d => (y(d.sourceName) || 0) + y.bandwidth() * 0.5 + margin!.top
      )
      .attr("hitColor", (_d, i, nodes) => {
        const hitColor = generateColor();
        this._colorToNodeMap[hitColor] = nodes[i] as ColorNode;
        return hitColor;
      });

    // @ts-ignore
    join = enterSelection.merge(join);

    join
      .each((_d, i, nodes) => {
        const node = d3.select(nodes[i]);
        const hitColor = node.attr("hitColor");
        this._colorToNodeMap[hitColor] = nodes[i] as ColorNode;
      })
      .transition()
      .duration(DURATION_MS)
      .attr("r", d => circleRadius!(d.value))
      .attr("cx", d => x(d.value) + margin!.left + 5)
      .attr(
        "cy",
        d => (y(d.sourceName) || 0) + y.bandwidth() * 0.5 + margin!.top
      );
  }

  private draw() {
    const { selectedNodeIds } = this.props;
    const canvas = this._canvas.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const custom = d3.select(this._customBase);
    const elements = custom.selectAll<HTMLElement, CommsSourceNode>(
      "custom.word"
    );

    elements.each((d, i, nodes) => {
      const node = d3.select(nodes[i]);
      const selected = includes(selectedNodeIds, d.id);
      const r = +node.attr("r");
      const cx = +node.attr("cx");
      const cy = +node.attr("cy");

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, ARC, false);
      ctx.fillStyle = selected ? "#00cb8e" : "#0095cd7f";
      ctx.fill();
    });
  }

  private drawHit() {
    const canvas = this._hitCanvas.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const custom = d3.select(this._customBase);
    const elements = custom.selectAll<HTMLElement, CommsSourceNode>(
      "custom.word"
    );

    elements.each((_d, i, nodes) => {
      const node = d3.select(nodes[i]);
      const r = Math.floor(+node.attr("r"));
      const cx = Math.floor(+node.attr("cx"));
      const cy = Math.floor(+node.attr("cy"));

      ctx.beginPath();
      ctx.fillStyle = node.attr("hitColor");
      ctx.rect(cx - r, cy - r, r + r, r + r);
      ctx.fill();
    });
  }

  private resizeCanvas(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const deviceScale = window.devicePixelRatio;
    canvas.width = width * deviceScale;
    canvas.height = height * deviceScale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(deviceScale, deviceScale);
  }

  private getNode(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas = this._hitCanvas.current!;
    const ctx = canvas.getContext("2d")!;
    const color = ctx.getImageData(
      event.nativeEvent.offsetX * 2,
      event.nativeEvent.offsetY * 2,
      1,
      1
    ).data;
    const key = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    const node = this._colorToNodeMap[key];
    return node;
  }

  handleClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const node = this.getNode(event);
    if (node) {
      this.props.onToggleNode(node.__data__);
    }
  };

  handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { onShowTooltip, onHideTooltip } = this.props;
    const node = this.getNode(event);
    if (!!node) {
      console.log("node", node, node.__data__);
      const selection = d3.select(node);
      const cx = +selection.attr("cx");
      const cy = +selection.attr("cy");
      const boundingRect = this._canvas.current!.getBoundingClientRect();
      const yInContainer = +(cy || 0) + boundingRect.top;
      const xInContainer = +(cx || 0) + boundingRect.left;
      onShowTooltip(node.__data__, {
        top: yInContainer - MAX_CIRCLE_RADIUS_PX,
        left: xInContainer - MAX_CIRCLE_RADIUS_PX,
        width: MAX_CIRCLE_RADIUS_PX * 2 + 3,
        height: MAX_CIRCLE_RADIUS_PX * 2
      });
    } else {
      onHideTooltip();
    }
  };

  handleMouseOut = () => {
    this.props.onHideTooltip();
  };

  render() {
    return (
      <>
        <canvas
          ref={this._canvas}
          className={styles.container}
          role="img"
          onClick={this.handleClick}
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseOut}
        />
        <canvas ref={this._hitCanvas} className={styles.hidden} />
      </>
    );
  }
}

export default CommsDataSourceCanvas;
