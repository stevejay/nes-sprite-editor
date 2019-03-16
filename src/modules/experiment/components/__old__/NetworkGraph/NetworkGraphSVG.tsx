import React from "react";
import { cloneDeep } from "lodash";
import styles from "./NetworkGraphSVG.module.scss";
import {
  default as networkGraph,
  INetworkGraph
} from "../../NetworkGraph/network-graph";
import {
  NodeEntity,
  LinkEntity,
  D3NodeEntity,
  D3LinkEntity
} from "../../NetworkGraph/types";

type Props = {
  nodes: Array<NodeEntity>;
  links: Array<LinkEntity>;
  selectedIds: Array<NodeEntity["id"]>;
  width: number;
  height: number;
  labelAccessor: (value: NodeEntity) => string;
  onShowTooltip: (value: NodeEntity, target: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: NodeEntity) => void;
};

type State = {
  nodes: Array<NodeEntity> | null;
  links: Array<LinkEntity> | null;
  d3Nodes: Array<D3NodeEntity> | null;
  d3Links: Array<D3LinkEntity> | null;
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
      .toggleNodeCallback(this.handleToggleNode)
      .labelAccessor(props.labelAccessor);
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
      d3Nodes: cloneDeep(props.nodes) as Array<D3NodeEntity>,
      d3Links: cloneDeep(props.links) as Array<D3LinkEntity>
    };
  }

  private handleShowTooltip = (value: NodeEntity, target: ClientRect) => {
    this.props.onShowTooltip(value, target);
  };

  private handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  private handleToggleNode = (value: NodeEntity) => {
    this.props.onToggleNode(value);
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
