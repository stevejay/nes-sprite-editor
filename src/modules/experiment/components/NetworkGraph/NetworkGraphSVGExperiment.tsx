import React from "react";
import { Node, Link } from "./NetworkGraph";
import styles from "./NetworkGraphSVG.module.scss";
import {
  default as networkGraphExperiment,
  INetworkGraph
} from "./network-graph-experiment";

type Props = {
  nodes: Array<Node>;
  links: Array<Link>;
  selectedIds: Array<number>;
  width: number;
  height: number;
  onShowTooltip: (value: Node, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: Node) => void;
};

class NetworkGraphSVGExperiment extends React.PureComponent<Props> {
  _svg: React.RefObject<SVGSVGElement>;
  _renderer: INetworkGraph;

  constructor(props: Props) {
    super(props);
    this._svg = React.createRef();
    this._renderer = networkGraphExperiment()
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode);
  }

  componentDidMount() {
    this.renderGraph(true);
  }

  componentDidUpdate(prevProps: Props) {
    this.renderGraph(
      this.props.nodes !== prevProps.nodes ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height
    );
  }

  private handleShowTooltip = (data: Node, originRect: ClientRect) => {
    this.props.onShowTooltip(data, originRect);
  };

  private handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  private handleToggleNode = (data: Node) => {
    this.props.onToggleNode(data);
  };

  private renderGraph(recalculateNodes: boolean) {
    const { nodes, links, width, height, selectedIds } = this.props;
    if (!(width > 0) || !(height > 0) || !nodes || !links) {
      return;
    }
    this._renderer
      .svgElement(this._svg.current!)
      .width(width)
      .height(height);
    this._renderer(nodes, links, selectedIds, recalculateNodes);
  }

  render() {
    return <svg className={styles.svg} ref={this._svg} />;
  }
}

export default NetworkGraphSVGExperiment;
