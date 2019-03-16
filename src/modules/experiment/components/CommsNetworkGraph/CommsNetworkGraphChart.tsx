import React from "react";
import * as d3 from "d3";
import styles from "./CommsNetworkGraphChart.module.scss";
import {
  default as networkGraphExperiment,
  INetworkGraph
} from "../NetworkGraph/d3-network-graph";
import {
  NodeEntity,
  LinkEntity,
  D3NodeEntity,
  D3LinkEntity
} from "../NetworkGraph";
import { CommunicationsNode } from "./types";
import { cloneDeep } from "lodash";
import commsNetworkGraphWorker from "./comms-network-graph-worker";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;
const STROKE_WIDTH = d3
  .scaleLinear()
  .domain([0, 1])
  .range([1, MIN_RADIUS - 2]);

type Props = {
  nodes: Array<NodeEntity>;
  links: Array<LinkEntity>;
  selectedIds: Array<NodeEntity["id"]>;
  width: number;
  height: number;
  onShowTooltip: (value: NodeEntity, target: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: NodeEntity) => void;
};

class CommsNetworkGraphChart extends React.PureComponent<Props> {
  _svg: React.RefObject<SVGSVGElement>;
  _renderer: INetworkGraph | null;
  _nodes: Array<D3NodeEntity>;
  _links: Array<D3LinkEntity>;
  _version: number;

  constructor(props: Props) {
    super(props);
    this._svg = React.createRef();
    this._renderer = null;
    this._nodes = [];
    this._links = [];
    this._version = 0;
  }

  componentDidMount() {
    this._renderer = networkGraphExperiment(this._svg.current!)
      .minRadius(MIN_RADIUS)
      .maxRadius(MAX_RADIUS)
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode)
      .updateLinks(selection => {
        selection
          .attr("x1", d => (d.source as D3NodeEntity).x || 0)
          .attr("y1", d => (d.source as D3NodeEntity).y || 0)
          .attr("x2", d => (d.target as D3NodeEntity).x || 0)
          .attr("y2", d => (d.target as D3NodeEntity).y || 0)
          .attr("stroke-width", d => STROKE_WIDTH(d.normalisedWeight));
      })
      .updateNodes(selection => {
        selection
          .classed("root", d => d.depth === 0)
          .classed(
            "account",
            d => d.depth > 0 && (d as CommunicationsNode).type === "account"
          )
          .classed(
            "market",
            d => d.depth > 0 && (d as CommunicationsNode).type === "market"
          );
      })
      .updateNodeCircles(selection => {
        selection.attr("r", d => (d.depth <= 1 ? MAX_RADIUS : MIN_RADIUS));
      })
      .updateNodeLabels(selection => {
        selection.text(d =>
          d.depth <= 1 ? (d as CommunicationsNode).initials : ""
        );
      });

    this.renderGraph(true);
  }

  componentDidUpdate(prevProps: Props) {
    this.renderGraph(
      this.props.nodes !== prevProps.nodes ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height
    );
  }

  private handleShowTooltip = (node: NodeEntity, target: ClientRect) => {
    if (node.depth === 0) {
      return;
    }
    this.props.onShowTooltip(node, target);
  };

  private handleHideTooltip = (node: NodeEntity) => {
    if (node.depth === 0) {
      return;
    }
    this.props.onHideTooltip();
  };

  private handleToggleNode = (node: NodeEntity) => {
    if (node.depth !== 1) {
      return;
    }
    this.props.onToggleNode(node);
  };

  private renderGraph(recalculateNodes: boolean) {
    const { nodes, links, width, height, selectedIds } = this.props;
    if (!(width > 0) || !(height > 0) || !nodes || !links) {
      return;
    }
    if (recalculateNodes) {
      this.recalculate();
    }
    this._renderer!.width(width)
      .height(height)
      .nodes(this._nodes)
      .links(this._links)(selectedIds);
  }

  private recalculate() {
    const { nodes, links, width, height } = this.props;

    this._version = Date.now();
    const event = {
      data: {
        nodes: cloneDeep(nodes),
        links: cloneDeep(links),
        width,
        height,
        maxRadius: MAX_RADIUS,
        version: this._version
      }
    };
    const result = commsNetworkGraphWorker(event);
    if (result.version === this._version) {
      this._nodes = result.nodes;
      this._links = result.links;
    }
  }

  render() {
    return <svg className={styles.svg} ref={this._svg} />;
  }
}

export default CommsNetworkGraphChart;
