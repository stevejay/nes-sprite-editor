import React from "react";
import styles from "./NetworkGraphSVG.module.scss";
import { NodeEntity, LinkEntity, D3NodeEntity, D3LinkEntity } from "./types";
import { cloneDeep, isNil, includes } from "lodash";
import networkGraphFakeWorkerAsync from "./network-graph-fake-worker-async";
import classNames from "classnames";
import { CommunicationsNode } from "./NetworkGraph";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;

type Props = {
  nodes: Array<NodeEntity>;
  links: Array<LinkEntity>;
  selectedIds: Array<NodeEntity["id"]>;
  width: number;
  height: number;
  onShowTooltip: (value: NodeEntity, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: NodeEntity) => void;
};

type State = {
  d3Nodes: Array<D3NodeEntity> | null;
  d3Links: Array<D3LinkEntity> | null;
};

class ReactNetworkGraphSVG extends React.PureComponent<Props, State> {
  // Used to ensure we don't show stale force simulation results:
  _dataVersion: number;

  constructor(props: Props) {
    super(props);
    this.state = { d3Nodes: null, d3Links: null };
    this._dataVersion = 0;
  }

  componentDidMount() {
    this.calculatePositions();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.nodes !== prevProps.nodes ||
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height
    ) {
      this.calculatePositions();
    }
  }

  private handleMouseOver = (
    event: React.MouseEvent<SVGCircleElement, MouseEvent>,
    node: D3NodeEntity
  ) => {
    const boundingRect = (event.target as SVGCircleElement).getBoundingClientRect();
    this.props.onShowTooltip(node, boundingRect);
  };

  private handleMouseOut = () => {
    this.props.onHideTooltip();
  };

  private handleClick = (
    _event: React.MouseEvent<SVGCircleElement, MouseEvent>,
    node: D3NodeEntity
  ) => {
    this.props.onToggleNode(node);
  };

  private async calculatePositions() {
    const { nodes, links, width, height } = this.props;
    if (!(width > 0) || !(height > 0) || !nodes || !links) {
      return;
    }
    this._dataVersion = Date.now();
    const event = {
      data: {
        nodes: cloneDeep(nodes),
        links: cloneDeep(links),
        width,
        height,
        maxRadius: MAX_RADIUS,
        version: this._dataVersion
      }
    };
    const result = await networkGraphFakeWorkerAsync(event);
    if (result.version === this._dataVersion) {
      // result is not stale so show it:
      this.setState({
        d3Nodes: result.nodes as Array<D3NodeEntity>,
        d3Links: result.links as Array<D3LinkEntity>
      });
    }
  }

  render() {
    const { width, height, selectedIds } = this.props;
    const { d3Nodes, d3Links } = this.state;
    return (
      <svg className={styles.svg} style={{ width, height }}>
        <g className="links-group">
          {!isNil(d3Links) &&
            d3Links.map((d3Link, index) => {
              const source = d3Link.source as D3NodeEntity;
              const target = d3Link.target as D3NodeEntity;
              return (
                <line
                  key={`${source.id}--${target.id}`}
                  strokeWidth={`${(index % 4) + 1}px`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                />
              );
            })}
        </g>
        <g className="nodes-group">
          {!isNil(d3Nodes) &&
            d3Nodes.map(d3Node => {
              const commsNode = d3Node as CommunicationsNode;
              const className = classNames("node", {
                root: d3Node.depth === 0,
                account: d3Node.depth > 0 && commsNode.type === "account",
                market: d3Node.depth > 0 && commsNode.type === "market",
                selected: includes(selectedIds, d3Node.id)
              });
              return (
                <g key={d3Node.id} className={className}>
                  <circle
                    cx={d3Node.x}
                    cy={d3Node.y}
                    r={d3Node.depth > 1 ? MIN_RADIUS : MAX_RADIUS}
                    onClick={
                      d3Node.depth === 1
                        ? event => this.handleClick(event, d3Node)
                        : undefined
                    }
                    onMouseOver={
                      d3Node.depth > 0
                        ? event => this.handleMouseOver(event, d3Node)
                        : undefined
                    }
                    onMouseOut={
                      d3Node.depth > 0 ? this.handleMouseOut : undefined
                    }
                  />
                  {d3Node.depth <= 1 && (
                    <text x={d3Node.x} y={d3Node.y} dx={0} dy={3}>
                      {commsNode.initials}
                    </text>
                  )}
                </g>
              );
            })}
        </g>
      </svg>
    );
  }
}

export default ReactNetworkGraphSVG;
