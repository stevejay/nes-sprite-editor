import * as d3 from "d3";
import { clamp, includes, debounce } from "lodash";
import React from "react";
import Flatbush from "flatbush";
import { TooltipData } from "../Tooltip/types";
import calculateWordCloudData from "./calculate-word-cloud-data";
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

class WordCloudCanvas extends React.Component<Props, State> {
  _canvas: React.RefObject<HTMLCanvasElement>;
  _mounted: boolean;
  _customBase: HTMLElement;
  _spatialIndex: typeof Flatbush | null;
  _timer: d3.Timer | null;

  constructor(props: Props) {
    super(props);
    this._canvas = React.createRef();
    this._mounted = true;
    this.state = { d3Nodes: [], bounds: [], dataVersion: 0 };
    this._customBase = document.createElement("custom");
    this._spatialIndex = null;
    this._timer = null;
  }

  componentDidMount() {
    const { width, height } = this.props;
    this.resizeCanvas(this._canvas.current!, width, height);
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
    }

    if (dimensionsChanged || nodesChanged || offsetOriginChanged) {
      this.calculateAsync();
    }

    if (d3NodesChanged || selectedNodesChanged) {
      this.drawWithAnimation();
    } else if (dimensionsChanged) {
      this.draw();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this._timer) {
      this._timer.stop();
      this._timer = null;
    }
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
    this._spatialIndex = null;
    this.dataBind();
    this.createSpatialIndex();

    if (this._timer) {
      this._timer.stop();
    }

    this._timer = d3.timer((elapsed: number) => {
      this.draw();
      if (elapsed > DURATION_MS) {
        if (this._timer) {
          this._timer.stop();
        }
      }
    });
  }

  private dataBind() {
    const custom = d3.select(this._customBase);

    let join = custom
      .selectAll<HTMLElement, D3WordCloudNode>("custom.word")
      .data(this.state.d3Nodes, d => d.id);

    join
      .exit()
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
      .attr("fontSize", d => d.size || 0);

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
      .attr("height", d => d.size || 0);
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

  private createSpatialIndex() {
    const nodes = this.state.d3Nodes;
    if (!nodes.length) {
      return;
    }

    this._spatialIndex = new Flatbush(nodes.length);

    nodes.forEach(node => {
      const width = node.width || 0;
      const fontSize = node.size || 0;
      const minX = (node.x || 0) + (node.x0 || 0) + Math.floor(width * 0.15);
      const minY = (node.y || 0) - Math.floor(fontSize * 0.8);
      this._spatialIndex.add(
        minX,
        minY,
        minX + (width - Math.floor(width * 0.3)),
        minY + Math.floor(fontSize)
      );
    });

    this._spatialIndex.finish();
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

  private getNode(offsetX: number, offsetY: number) {
    if (!this._spatialIndex) {
      return null;
    }

    const { width, height } = this.props;
    const { d3Nodes } = this.state;
    const searchX = offsetX - width * 0.5;
    const searchY = offsetY - height * 0.5;

    const indexes = this._spatialIndex.search(
      searchX,
      searchY,
      searchX,
      searchY
    );

    if (!indexes.length) {
      return null;
    }

    return d3Nodes.length > indexes[0] ? d3Nodes[indexes[0]] : null;
  }

  handleClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const node = this.getNode(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
    if (node) {
      this.props.onToggleNode(node);
    }
  };

  handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    this.debouncedHandleMouseMove(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
  };

  debouncedHandleMouseMove = debounce((offsetX: number, offsetY: number) => {
    const { width, height, onShowTooltip, onHideTooltip } = this.props;
    const node = this.getNode(offsetX, offsetY);
    if (!!node) {
      const boundingRect = this._canvas.current!.getBoundingClientRect();
      const yInContainer = (node.y || 0) + boundingRect.top + height * 0.5;
      const xInContainer = (node.x || 0) + boundingRect.left + width * 0.5;

      onShowTooltip(node, {
        top: yInContainer,
        left: xInContainer,
        width: 1,
        height: 6
      });
    } else {
      onHideTooltip();
    }
  }, 30);

  handleMouseOut = () => {
    this.props.onHideTooltip();
  };

  render() {
    return (
      <canvas
        ref={this._canvas}
        className={classNames(styles.container, this.props.className)}
        role="img"
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseOut}
      />
    );
  }
}

export default WordCloudCanvas;
