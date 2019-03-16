import React from "react";
import { default as d3HeatMap, ID3HeatMap } from "./d3-heat-map";
import { HeatMapNode } from "./types";
import { TooltipData } from "../Tooltip/types";

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

class SvgHeatMapSvg extends React.Component<Props> {
  _container: React.RefObject<SVGSVGElement>;
  _renderer: ID3HeatMap;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._renderer = d3HeatMap()
      .rows(props.rows)
      .columns(props.columns);
    if (props.coloring) {
      this._renderer.coloring(props.coloring);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.width !== this.props.width ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const eventData = this.getEventData(event.clientX, event.clientY);
    if (!eventData) {
      return;
    }
    this.props.onToggleNode(this.props.nodes[eventData.index]);
  };

  handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
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

  private renderGraph() {
    const { nodes, width, selectedIds } = this.props;
    if (!(width > 0) || !nodes) {
      return;
    }
    this._renderer.container(this._container.current!).width(width);
    this._renderer(nodes, selectedIds);
  }

  render() {
    return (
      <svg
        ref={this._container}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default SvgHeatMapSvg;
