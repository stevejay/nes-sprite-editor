import React from "react";
import styles from "./CanvasWordCloudCanvas.module.scss";
import { WordCloudNode, D3WordCloudNode } from "./types";
import calculateWordCloudData from "./calculate-word-cloud-data";

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

  constructor(props: Props) {
    super(props);
    this._canvasRef = React.createRef();
    this._mounted = true;
    this.state = { d3Nodes: [], bounds: [], dataVersion: 0 };
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
    console.log("rendering");
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
