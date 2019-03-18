import React from "react";
import styles from "./CommsDataSourceChart.module.scss";
import { CommsSourceNode } from "./types";
import { TooltipData } from "../Tooltip";
import d3CommsDataSourceChart, {
  ICommsDataSourceGraph
} from "./d3-comms-data-source-chart";

type Props = {
  width: number;
  height: number;
  nodes: Array<CommsSourceNode>;
  selectedIds: Array<CommsSourceNode["id"]>;
  onShowTooltip: (node: CommsSourceNode, target: TooltipData["target"]) => void;
  onHideTooltip: (node: CommsSourceNode) => void;
  onToggleNode: (node: CommsSourceNode) => void;
};

class CommsDataSourceChart extends React.Component<Props> {
  _svg: React.RefObject<SVGSVGElement>;
  _renderer: ICommsDataSourceGraph | null;

  constructor(props: Props) {
    super(props);
    this._svg = React.createRef();
    this._renderer = null;
  }

  componentDidMount() {
    this._renderer = d3CommsDataSourceChart(this._svg.current!)
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode);
    this.renderChart();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.selectedIds !== this.props.selectedIds ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    );
  }

  componentDidUpdate(prevProps: Props) {
    this.renderChart();
  }

  private handleShowTooltip = (node: CommsSourceNode, target: ClientRect) => {
    this.props.onShowTooltip(node, target);
  };

  private handleHideTooltip = (node: CommsSourceNode) => {
    this.props.onHideTooltip(node);
  };

  private handleToggleNode = (node: CommsSourceNode) => {
    this.props.onToggleNode(node);
  };

  private renderChart() {
    const { nodes, width, height, selectedIds } = this.props;
    if (!(width > 0) || !(height > 0) || !nodes) {
      return;
    }
    this._renderer!.width(width)
      .height(height)
      .nodes(nodes)(selectedIds);
  }

  render() {
    return <svg className={styles.svg} ref={this._svg} />;
  }
}

export default CommsDataSourceChart;
