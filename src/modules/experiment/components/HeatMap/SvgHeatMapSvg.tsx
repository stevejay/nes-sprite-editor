import React from "react";
import { default as heatMap, IHeatMap } from "./heat-map";
import { HeatMapNode } from "./types";

type Props = {
  width: number;
  nodes: Array<HeatMapNode>;
  rows: number;
  columns: number;
  selectedIds: Array<number>;
  onToggleNode: (node: HeatMapNode) => void;
  onShowTooltip: (node: HeatMapNode, originRect: ClientRect) => void;
  onHideTooltip: () => void;
};

class SvgHeatMapSvg extends React.Component<Props> {
  _container: React.RefObject<SVGSVGElement>;
  _renderer: IHeatMap;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._renderer = heatMap()
      .rows(props.rows)
      .columns(props.columns)
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode);
  }

  componentDidMount() {
    this.renderGraph();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.width !== this.props.width ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  private handleShowTooltip = (value: HeatMapNode, originRect: ClientRect) => {
    this.props.onShowTooltip(value, originRect);
  };

  private handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  private handleToggleNode = (value: HeatMapNode) => {
    this.props.onToggleNode(value);
  };

  private renderGraph() {
    const { nodes, width, selectedIds } = this.props;
    if (!(width > 0) || !nodes) {
      return;
    }
    this._renderer.containerElement(this._container.current!).width(width);
    this._renderer(nodes, selectedIds);
  }

  render() {
    return <svg ref={this._container} />;
  }
}

export default SvgHeatMapSvg;
