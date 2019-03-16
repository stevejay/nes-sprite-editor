import React from "react";
import * as d3 from "d3";
import heatMapColoring from "./heat-map-coloring";
import styles from "./HeatMapCanvasChart.module.scss";
import { HeatMapNode } from "./types";
import { TooltipData } from "../Tooltip/types";
import { includes } from "lodash";
import drawRoundedRect from "./draw-rounded-rect";

const MARGIN_PX = 1;
const DURATION_MS = 250;

type Props = {
  width: number;
  nodes: Array<HeatMapNode>;
  rows: number;
  columns: number;
  selectedIds: Array<number>;
  coloring?: (node: HeatMapNode, selected: boolean) => string;
  onToggleNode: (node: HeatMapNode) => void;
  onShowTooltip: (node: HeatMapNode, target: TooltipData["target"]) => void;
  onHideTooltip: () => void;
};

class HeatMapCanvasChart extends React.Component<Props> {
  _container: React.RefObject<HTMLCanvasElement>;
  _customBase: HTMLElement;
  _timer: d3.Timer | null;
  _coloring: (node: HeatMapNode, selected: boolean) => string;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._customBase = document.createElement("custom");
    this._timer = null;
    this._coloring = props.coloring || heatMapColoring;
  }

  componentDidMount() {
    this.renderHeatMap(true);
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.width !== this.props.width ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  componentDidUpdate(prevProps: Props) {
    this.renderHeatMap(this.props.width !== prevProps.width);
  }

  componentWillUnmount() {
    if (this._timer) {
      this._timer.stop();
    }
    this._timer = null;
  }

  handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const eventData = this.getEventData(event.clientX, event.clientY);
    if (!eventData) {
      return;
    }
    this.props.onToggleNode(this.props.nodes[eventData.index]);
  };

  handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const eventData = this.getEventData(event.clientX, event.clientY);
    if (!eventData) {
      return;
    }
    this.props.onShowTooltip(
      this.props.nodes[eventData.index],
      eventData.target
    );
  };

  handleMouseLeave = () => {
    this.props.onHideTooltip();
  };

  getEventData(clientX: number, clientY: number) {
    const { rows, columns } = this.props;
    const boundingRect = this._container!.current!.getBoundingClientRect();
    const yInContainer = clientY - boundingRect.top;
    const xInContainer = clientX - boundingRect.left;
    const dimension = boundingRect.width / columns;
    const row = Math.floor(yInContainer / dimension);
    const column = Math.floor(xInContainer / dimension);
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      return null;
    }
    return {
      index: row * columns + column,
      target: {
        top: row * dimension + boundingRect.top,
        left: column * dimension + boundingRect.left,
        width: dimension,
        height: dimension
      }
    };
  }

  private renderHeatMap(resize: boolean) {
    const { nodes, width, columns, rows } = this.props;
    if (!(width > 0) || !nodes) {
      return;
    }

    const dimension = width / columns;
    const height = dimension * rows;

    if (resize) {
      this.resize(width, height);
      this.draw();
    }

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
        this.draw();
      }
    });
  }

  private dataBind() {
    const { nodes, selectedIds } = this.props;

    const join = d3
      .select(this._customBase)
      .selectAll(".tile")
      .data(nodes, (d: any) => d.id);

    join
      .enter()
      .append("custom")
      .attr("class", "tile")
      .attr("fill", d => this._coloring(d, includes(selectedIds, d.id)));

    join
      .transition()
      .attr("fill", d => this._coloring(d, includes(selectedIds, d.id)));
  }

  private draw() {
    const { width, columns } = this.props;
    const dimension = width / columns;
    const canvas = this._container.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    d3.select(this._customBase)
      .selectAll<HTMLElement, HeatMapNode>(".tile")
      .each((d, i, nodes) => {
        const node = d3.select(nodes[i]);
        const x = (d.id % columns) * dimension + MARGIN_PX;
        const y = Math.floor(d.id / columns) * dimension + MARGIN_PX;
        const width = dimension - MARGIN_PX * 2;
        const height = dimension - MARGIN_PX * 2;
        ctx.fillStyle = node.attr("fill");
        drawRoundedRect(ctx, x, y, width, height, MARGIN_PX * 4);
      });

    ctx.restore();
  }

  private resize(width: number, height: number) {
    const canvas = this._container.current!;
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
      <canvas
        ref={this._container}
        className={styles.canvas}
        role="img"
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default HeatMapCanvasChart;
