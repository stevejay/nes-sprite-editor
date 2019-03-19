import * as d3 from "d3";
import { clamp, includes } from "lodash";
import React from "react";
import { TooltipData } from "../Tooltip/types";
import calculateWordCloudData from "./calculate-word-cloud-data";
import generateColor from "./generate-color";
import { D3WordCloudNode, WordCloudNode } from "./types";
import styles from "./WordCloudCanvasChart.module.scss";
import classNames from "classnames";

const DURATION_MS = 500;

type Props = {
  originXOffset: number;
  cloudWidth: number;
  width: number;
  height: number;
  nodes: Array<WordCloudNode>;
  selectedNodeIds: Array<WordCloudNode["id"]>;
  className?: string;
  onShowTooltip: (value: WordCloudNode, target: TooltipData["target"]) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: WordCloudNode) => void;
  onCalculationCompleted?: () => void;
};

type State = {
  dataVersion: number;
  d3Nodes: Array<D3WordCloudNode>;
  bounds: Array<{ x: number; y: number }>;
};

// var c = document.createElement("canvas"); ???

class WordCloudCanvas extends React.Component<Props, State> {
  _canvas: React.RefObject<HTMLCanvasElement>;
  _hitCanvas: React.RefObject<HTMLCanvasElement>;
  _mounted: boolean;
  _customBase: HTMLElement;
  _timer: d3.Timer | null;
  _colorToNodeMap: { [key: string]: D3WordCloudNode };

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
    const { width, height } = this.props;
    this.resizeCanvas(this._canvas.current!, width, height);
    this.resizeCanvas(this._hitCanvas.current!, width, height);
    if (!(width > 0) || !(height > 0)) {
      return;
    }
    this.calculateAsync();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { width, height, nodes, selectedNodeIds, originXOffset } = this.props;
    const { d3Nodes } = this.state;
    const dimensionsChanged =
      width !== prevProps.width || height !== prevProps.height;
    const nodesChanged = nodes !== prevProps.nodes;
    const selectedNodesChanged = selectedNodeIds !== prevProps.selectedNodeIds;
    const offsetOriginChanged = originXOffset !== prevProps.originXOffset;
    const d3NodesChanged = d3Nodes !== prevState.d3Nodes;

    if (dimensionsChanged) {
      this.resizeCanvas(this._canvas.current!, width, height);
      this.resizeCanvas(this._hitCanvas.current!, width, height);
    }

    if (dimensionsChanged || nodesChanged || offsetOriginChanged) {
      this.calculateAsync();
    }

    if (d3NodesChanged || selectedNodesChanged) {
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

  private async calculateAsync() {
    const {
      height,
      nodes,
      originXOffset,
      cloudWidth,
      selectedNodeIds,
      onCalculationCompleted
    } = this.props;
    const dataVersion = Date.now();
    this.setState({ dataVersion });
    const { d3Nodes, bounds } = await calculateWordCloudData(
      nodes,
      selectedNodeIds,
      cloudWidth,
      height,
      10,
      32
    );
    if (onCalculationCompleted) {
      onCalculationCompleted();
    }
    if (originXOffset !== 0) {
      d3Nodes.forEach(node => {
        node.x = (node.x || 0) + originXOffset;
      });
    }
    if (this._mounted) {
      this.setState(state =>
        state.dataVersion === dataVersion
          ? { d3Nodes, bounds, dataVersion }
          : state
      );
    }
  }

  private drawWithAnimation() {
    this.dataBind();

    if (this._timer) {
      this._timer.stop();
    }

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
    const custom = d3.select(this._customBase);
    const colorToNodeMap = this._colorToNodeMap;

    let join = custom
      .selectAll<HTMLElement, D3WordCloudNode>("custom.word")
      .data(this.state.d3Nodes, d => d.id);

    join
      .exit()
      .each((_d, i, nodes) => {
        const key = d3.select(nodes[i]).attr("hitColor");
        delete colorToNodeMap[key];
      })
      .transition()
      .duration(DURATION_MS)
      .attr("opacity", 1e-6)
      .remove();

    const enterSelection = join
      .enter()
      .append("custom")
      .attr("class", "word")
      .attr("opacity", 1e-6)
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0)
      .attr("width", d => d.width || 0)
      .attr("height", d => d.height || 0)
      .attr("fontSize", d => d.size || 0)
      .attr("hitColor", d => {
        const hitColor = generateColor();
        this._colorToNodeMap[hitColor] = d;
        return hitColor;
      });

    // @ts-ignore
    join = enterSelection.merge(join);

    join
      .attr("fontSize", d => d.size || 0)
      .transition()
      .duration(DURATION_MS)
      .attr("opacity", 1)
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0)
      .attr("width", d => d.width || 0)
      .attr("height", d => d.size || 0)
      .each((d, i, nodes) => {
        const hitColor = d3.select(nodes[i]).attr("hitColor");
        this._colorToNodeMap[hitColor] = d;
      });
  }

  private draw() {
    const { selectedNodeIds, width, height } = this.props;
    const canvas = this._canvas.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(width * 0.5, height * 0.5);

    const custom = d3.select(this._customBase);
    const elements = custom.selectAll<HTMLElement, D3WordCloudNode>(
      "custom.word"
    );
    ctx.textAlign = "center";

    elements.each((d, i: number, nodes) => {
      const node = d3.select(nodes[i]);
      const selected = includes(selectedNodeIds, d.id);
      const x = +node.attr("x");
      const y = +node.attr("y");
      ctx.font = `${node.attr("fontSize")}px sans-serif`;
      ctx.fillStyle = selected
        ? `rgba(0, 203, 142, ${clamp(+node.attr("opacity"), 0, 1)})`
        : `rgba(0, 150, 203, ${clamp(+node.attr("opacity"), 0, 1)})`;
      ctx.fillText(d.text, x, y);
    });

    ctx.restore();
  }

  private drawHit() {
    const { width, height } = this.props;
    const canvas = this._hitCanvas.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(width * 0.5, height * 0.5);

    const custom = d3.select(this._customBase);
    const elements = custom.selectAll<HTMLElement, D3WordCloudNode>(
      "custom.word"
    );

    elements.each((d, i: number, nodes) => {
      const node = d3.select(nodes[i]);
      ctx.beginPath();
      ctx.fillStyle = node.attr("hitColor");
      const x = +node.attr("x");
      const y = +node.attr("y");
      const width = +node.attr("width");
      const fontSize = +node.attr("fontSize");
      ctx.rect(
        x + (d.x0 || 0) + Math.floor(width * 0.15),
        y - Math.floor(fontSize * 0.8),
        width - Math.floor(width * 0.3),
        Math.floor(fontSize)
      );
      ctx.fill();
    });

    ctx.restore();
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
      this.props.onToggleNode(node);
    }
  };

  handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { width, height, onShowTooltip, onHideTooltip } = this.props;
    const node = this.getNode(event);
    if (!!node) {
      const boundingRect = this._canvas.current!.getBoundingClientRect();
      const yInContainer = +(node.y || 0) + boundingRect.top + height * 0.5;
      const xInContainer = +(node.x || 0) + boundingRect.left + width * 0.5;

      onShowTooltip(node, {
        top: yInContainer,
        left: xInContainer,
        width: 1,
        height: 6
      });
    } else {
      onHideTooltip();
    }
  };

  handleMouseOut = () => {
    this.props.onHideTooltip();
  };

  render() {
    const className = classNames(styles.container, this.props.className);
    return (
      <>
        <canvas
          ref={this._canvas}
          className={className}
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

export default WordCloudCanvas;
