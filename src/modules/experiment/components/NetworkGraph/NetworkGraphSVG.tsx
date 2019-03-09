import React from "react";
import { CommunicationsNode, Link } from "./NetworkGraph";
import { cloneDeep } from "lodash";
import styles from "./NetworkGraphSVG.module.scss";
import { default as networkGraph, INetworkGraph } from "./network-graph";

type Props = {
  nodes: Array<CommunicationsNode>;
  links: Array<Link>;
  selectedIds: Array<number>;
  width: number;
  height: number;
  onShowTooltip: (value: CommunicationsNode, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: CommunicationsNode) => void;
};

type State = {
  nodes: Array<CommunicationsNode> | null;
  links: Array<Link> | null;
  d3Nodes: Array<CommunicationsNode> | null;
  d3Links: Array<Link> | null;
};

class NetworkGraphSVG extends React.PureComponent<Props, State> {
  _svg: React.RefObject<SVGSVGElement>;
  _renderer: INetworkGraph;

  constructor(props: Props) {
    super(props);
    this._svg = React.createRef();
    this._renderer = networkGraph()
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode);
    this.state = NetworkGraphSVG.createState(props);
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return props.nodes !== state.nodes
      ? NetworkGraphSVG.createState(props)
      : state;
  }

  static createState(props: Props) {
    return {
      nodes: props.nodes,
      links: props.links,
      d3Nodes: cloneDeep(props.nodes),
      d3Links: cloneDeep(props.links)
    };
  }

  private handleShowTooltip = (
    data: CommunicationsNode,
    originRect: ClientRect
  ) => {
    this.props.onShowTooltip(data, originRect);
  };

  private handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  private handleToggleNode = (data: CommunicationsNode) => {
    this.props.onToggleNode(data);
  };

  private renderGraph() {
    const { width, height, selectedIds } = this.props;
    const { d3Nodes, d3Links } = this.state;
    if (!(width > 0) || !(height > 0) || !d3Nodes || !d3Links) {
      return;
    }
    this._renderer
      .svgElement(this._svg.current!)
      .width(width)
      .height(height);
    this._renderer(d3Nodes, d3Links, selectedIds);
  }

  render() {
    return <svg className={styles.svg} ref={this._svg} />;
  }
}

export default NetworkGraphSVG;
