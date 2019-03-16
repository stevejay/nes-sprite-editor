import React from "react";
import * as d3 from "d3";
import styles from "./CanvasWordCloudCanvas.module.scss";
import { WordCloudNode, D3WordCloudNode } from "./types";
import calculateWordCloudData from "./calculate-word-cloud-data";
import { element } from "prop-types";
import { clamp, includes } from "lodash";
import generateColor from "./generate-color";
import { TooltipData } from "../Tooltip/types";

const DURATION_MS = 500;

type Props = {
  width: number;
  height: number;
  nodes: Array<WordCloudNode>;
  selectedNodeIds: Array<WordCloudNode["id"]>;
  onShowTooltip: (
    value: WordCloudNode,
    target: TooltipData["target"]
  ) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: WordCloudNode) => void;
};

type State = {
  dataVersion: number;
  d3Nodes: Array<D3WordCloudNode>;
  bounds: Array<{ x: number; y: number }>;
};

// var c = document.createElement("canvas"); ???

class CanvasWordCloudCanvas extends React.Component<Props, State> {
  _canvasRef: React.RefObject<HTMLCanvasElement>;
  _hitCanvasRef: React.RefObject<HTMLCanvasElement>;
  _mounted: boolean;
  _customBase: HTMLElement;
  _timer: d3.Timer | null;
  _colorToNodeMap: { [key: string]: D3WordCloudNode };

  constructor(props: Props) {
    super(props);
    this._canvasRef = React.createRef();
    this._hitCanvasRef = React.createRef();
    this._mounted = true;
    this.state = { d3Nodes: [], bounds: [], dataVersion: 0 };
    this._customBase = document.createElement("custom");
    this._timer = null;
    this._colorToNodeMap = {};
  }

  componentDidMount() {
    const { width, height } = this.props;
    this.resizeCanvas(this._canvasRef.current!, width, height);
    this.resizeCanvas(this._hitCanvasRef.current!, width, height);
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
      this.resizeCanvas(this._canvasRef.current!, width, height);
      this.resizeCanvas(this._hitCanvasRef.current!, width, height);
    }
    if (dimensionsChanged || nodesChanged) {
      this.calculateAsync();
    }
    if (d3NodesChanged || selectedNodesChanged) {
      this.renderWordCloud();
    } else if (dimensionsChanged) {
      this.draw();
      this.drawHit();
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

    const join = custom
      .selectAll("custom.word")
      .data(this.state.d3Nodes, d => d.id);

    join
      .exit()
      .each(function() {
        // !!! MUST BE A FUNCTION NOT A LAMBDA !!!
        const key = d3.select(this).attr("hitColor");
        delete colorToNodeMap[key];
      })
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
      .attr("fontSize", d => d.size)
      .attr("hitColor", d => {
        const hitColor = generateColor();
        this._colorToNodeMap[hitColor] = d;
        return hitColor;
      });
    // .property('fooo', 1234)
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
      .attr("height", d => d.size); // d.height);
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

      // if (index === 0) {
      //   ctx.strokeStyle = "red";
      //   ctx.beginPath();
      //   ctx.strokeRect(
      //     +node.attr("x") + d.x0 + 20,
      //     +node.attr("y") + d.y0 + 4,
      //     +node.attr("width") - 40,
      //     +node.attr("height") - 8
      //   );
      // }
    });

    ctx.restore();
  }

  private drawHit() {
    // const { selectedNodeIds } = this.props;
    const canvas = this._hitCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(this.props.width * 0.5, this.props.height * 0.5); // TODO fix

    const custom = d3.select(this._customBase);
    const elements = custom.selectAll("custom.word");
    // ctx.textAlign = "center";

    // console.log("hitmap size", Object.keys(this._colorToNodeMap).length);

    elements.each(function(d: D3WordCloudNode, index: number) {
      const node = d3.select(this);
      // console.log("d", d);
      ctx.beginPath();
      ctx.fillStyle = node.attr("hitColor");
      // console.log(
      //   "rect",
      //   +node.attr("x"),
      //   +node.attr("y"),
      //   +node.attr("width"),
      //   +node.attr("height")
      // );
      const x = +node.attr("x");
      const y = +node.attr("y");
      const width = +node.attr("width");
      const height = +node.attr("height");
      ctx.rect(
        x + d.x0 + Math.floor(width * 0.15),
        y + d.y0 + Math.floor(height * 0.1),
        width - Math.floor(width * 0.3),
        height - Math.floor(height * 0.2)
      );
      ctx.fill();
      // const selected = includes(selectedNodeIds, d.id);
      // ctx.font = `${node.attr("fontSize")}px sans-serif`;
      // ctx.fillStyle = selected
      //   ? `rgba(0, 203, 142, ${clamp(+node.attr("opacity"), 0, 1)})`
      //   : `rgba(0, 150, 203, ${clamp(+node.attr("opacity"), 0, 1)})`;
      // ctx.fillText(d.text, +node.attr("x"), +node.attr("y"));
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
    // this.drawHit();
    const canvas = this._hitCanvasRef.current!;
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
      // console.log("clicked on", node.text);
      this.props.onToggleNode(node);
    }
  };

  handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const node = this.getNode(event);
    if (node) {
      this.props.onShowTooltip(node, {
        top: 300,
        left: 300,
        width: 20,
        height: 20
      });
    } else {
      this.props.onHideTooltip();
    }
  };

  handleMouseOut = () => {
    this.props.onHideTooltip();
  };

  render() {
    return (
      <>
        <canvas
          ref={this._canvasRef}
          className={styles.canvas}
          role="img"
          onClick={this.handleClick}
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseOut}
        />
        <canvas
          ref={this._hitCanvasRef}
          className={styles.canvas}
          style={{ display: "none" }}
        />
      </>
    );
  }
}

export default CanvasWordCloudCanvas;
