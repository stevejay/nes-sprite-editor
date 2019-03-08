import React from "react";
import { Node, Link } from "./NetworkGraph";
import { cloneDeep } from "lodash";
import styles from "./NetworkGraphSVG.module.scss";
import { default as networkGraph, INetworkGraph } from "./network-graph";

type Props = {
  nodes: Array<Node>;
  links: Array<Link>;
  selectedIndexes: Array<number>;
  width: number;
  height: number;
  onShowTooltip: (value: Node, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: Node) => void;
};

type State = {
  nodes: Array<Node> | null;
  links: Array<Link> | null;
  d3Nodes: Array<Node> | null;
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

  private handleShowTooltip = (data: Node, originRect: ClientRect) => {
    this.props.onShowTooltip(data, originRect);
  };

  private handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  private handleToggleNode = (data: Node) => {
    this.props.onToggleNode(data);
  };

  private renderGraph() {
    const { width, height, selectedIndexes } = this.props;
    const { d3Nodes, d3Links } = this.state;
    if (!(width > 0) || !(height > 0) || !d3Nodes || !d3Links) {
      return;
    }
    this._renderer
      .svgElement(this._svg.current!)
      .width(width)
      .height(height);
    this._renderer(d3Nodes, d3Links, selectedIndexes);
  }

  render() {
    return <svg className={styles.svg} ref={this._svg} />;
  }
}

export default NetworkGraphSVG;
