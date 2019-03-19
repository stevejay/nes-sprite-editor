import React from "react";
import styles from "./CommsDataSourceChart.module.scss";
import { CommsSourceNode, Margin } from "./types";
import d3CommsDataSourceChart, {
  ICommsDataSourceGraph
} from "./d3-comms-data-source-chart";

type Props = {
  width: number;
  height: number;
  nodes: Array<CommsSourceNode>;
  onMarginChanged: (margin: Margin) => void;
};

class CommsDataSourceChart extends React.Component<Props> {
  _container: React.RefObject<SVGSVGElement>;
  _renderer: ICommsDataSourceGraph | null;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._renderer = null;
  }

  componentDidMount() {
    this._renderer = d3CommsDataSourceChart(this._container.current!);
    this.renderChart();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    );
  }

  componentDidUpdate() {
    this.renderChart();
  }

  private renderChart() {
    const { nodes, width, height, onMarginChanged } = this.props;
    if (!(width > 0) || !(height > 0) || !nodes) {
      return;
    }
    const margin = this._renderer!.width(width)
      .height(height)
      .nodes(nodes)();
    onMarginChanged(margin);
  }

  render() {
    return <svg className={styles.svg} ref={this._container} />;
  }
}

export default CommsDataSourceChart;
