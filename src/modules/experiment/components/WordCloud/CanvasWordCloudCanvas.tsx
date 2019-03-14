import React from "react";
import * as d3 from "d3";
import styles from "./CanvasWordCloudCanvas.module.scss";
import { WordCloudNode, D3WordCloudNode } from "./types";
import calculateWordCloudData from "./calculate-word-cloud-data";
import { element } from "prop-types";
import { clamp, includes } from "lodash";

const DURATION_MS = 500;

type Props = {
  width: number;
  height: number;
  nodes: Array<WordCloudNode>;
  selectedNodeIds: Array<WordCloudNode["id"]>;
  onShowTooltip: (value: WordCloudNode, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: WordCloudNode) => void;
};

type State = {
  dataVersion: number;
  d3Nodes: Array<D3WordCloudNode>;
  bounds: Array<{ x: number; y: number }>;
};

class CanvasWordCloudCanvas extends React.Component<Props, State> {
  _canvasRef: React.RefObject<HTMLCanvasElement>;
  _mounted: boolean;
  _customBase: HTMLElement;
  _timer: d3.Timer | null;

  constructor(props: Props) {
    super(props);
    this._canvasRef = React.createRef();
    this._mounted = true;
    this.state = { d3Nodes: [], bounds: [], dataVersion: 0 };
    this._customBase = document.createElement("custom");
    this._timer = null;
  }

  componentDidMount() {
    const { width, height } = this.props;
    this.resizeCanvas(width, height);
    if (!(width > 0) || !(height > 0)) {
      return;
    }
    this.calculateAsync();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { width, height, nodes, selectedNodeIds } = this.props;
    const { d3Nodes } = this.state;
    const dimensionsChanged =
      width !== prevProps.width || height !== prevProps.height;
    const nodesChanged = nodes !== prevProps.nodes;
    const selectedNodesChanged = selectedNodeIds !== prevProps.selectedNodeIds;
    const d3NodesChanged = d3Nodes !== prevState.d3Nodes;

    if (dimensionsChanged) {
      this.resizeCanvas(width, height);
    }
    if (dimensionsChanged || nodesChanged) {
      this.calculateAsync();
    }
    if (d3NodesChanged || selectedNodesChanged) {
      this.renderWordCloud();
    } else if (dimensionsChanged) {
      this.draw();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  private async calculateAsync() {
    const { width, height, nodes } = this.props;
    const dataVersion = Date.now();
    this.setState({ dataVersion });
    const { d3Nodes, bounds } = await calculateWordCloudData(
      nodes,
      width,
      height,
      10,
      32
    );
    if (this._mounted) {
      this.setState(state =>
        state.dataVersion === dataVersion
          ? { d3Nodes, bounds, dataVersion }
          : state
      );
    }
  }

  private renderWordCloud() {
    this.dataBind();

    if (this._timer) {
      this._timer.stop();
    }

    this._timer = d3.timer((elapsed: number) => {
      this.draw();
      if (elapsed > DURATION_MS && this._timer) {
        this._timer.stop();
      }
    });
  }

  private dataBind() {
    const custom = d3.select(this._customBase);

    const join = custom
      .selectAll("custom.word")
      .data(this.state.d3Nodes, d => d.id);

    join
      .exit()
      .transition()
      .duration(DURATION_MS)
      .attr("opacity", 1e-6)
      // .attr("fontSize", 10)
      .remove();

    const enterSelection = join
      .enter()
      .append("custom")
      .attr("class", "word")
      .attr("opacity", 1e-6)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .attr("fontSize", d => d.size);
    // .attr("fontSize", 10);

    join
      .merge(enterSelection)
      .attr("fontSize", d => d.size)
      .transition()
      .duration(DURATION_MS)
      .attr("opacity", 1)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.width)
      .attr("height", d => d.height);
    // .attr("fontSize", d => d.size);
  }

  private draw() {
    const { selectedNodeIds } = this.props;
    const canvas = this._canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(this.props.width * 0.5, this.props.height * 0.5); // TODO fix

    const custom = d3.select(this._customBase);
    const elements = custom.selectAll("custom.word");
    ctx.textAlign = "center";

    elements.each(function(d: D3WordCloudNode, index: number) {
      const node = d3.select(this);
      const selected = includes(selectedNodeIds, d.id);
      ctx.font = `${node.attr("fontSize")}px sans-serif`;
      ctx.fillStyle = selected
        ? `rgba(0, 203, 142, ${clamp(+node.attr("opacity"), 0, 1)})`
        : `rgba(0, 150, 203, ${clamp(+node.attr("opacity"), 0, 1)})`;
      ctx.fillText(d.text, +node.attr("x"), +node.attr("y"));
    });

    ctx.restore();
  }

  private resizeCanvas(width: number, height: number) {
    const canvas = this._canvasRef.current!;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const deviceScale = window.devicePixelRatio;
    canvas.width = width * deviceScale;
    canvas.height = height * deviceScale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(deviceScale, deviceScale);
  }

  render() {
    return (
      <canvas ref={this._canvasRef} className={styles.canvas} role="img" />
    );
  }
}

export default CanvasWordCloudCanvas;
