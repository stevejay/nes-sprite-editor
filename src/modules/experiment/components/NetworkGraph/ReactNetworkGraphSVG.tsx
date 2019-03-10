import React from "react";
import styles from "./ReactNetworkGraphSVG.module.scss";
import { NodeEntity, LinkEntity, D3NodeEntity, D3LinkEntity } from "./types";
import { cloneDeep, isNil, includes } from "lodash";
import { Transition, animated } from "react-spring/renderprops";
import networkGraphFakeWorkerAsync from "./network-graph-fake-worker-async";
import classNames from "classnames";
import { CommunicationsNode } from "./NetworkGraph";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;
const MAIN_CONFIG = { duration: 250 };
const LEAVE_CONFIG = { duration: MAIN_CONFIG.duration + 50 };
const CONFIG = (_item: any, state: any) =>
  state === "leave" ? LEAVE_CONFIG : MAIN_CONFIG;
const LINK_KEYS = (item: D3LinkEntity) =>
  `${(item.source as D3NodeEntity).id}--${(item.target as D3NodeEntity).id}`;
const NODE_KEYS = (item: D3NodeEntity) => item.id;

const HIDDEN_LINE = (item: D3LinkEntity) => ({
  opacity: 0,
  x1: (item.source as D3NodeEntity).x,
  y1: (item.source as D3NodeEntity).y,
  x2: (item.target as D3NodeEntity).x,
  y2: (item.target as D3NodeEntity).y
});

const VISIBLE_LINE = (item: D3LinkEntity) => ({
  opacity: 1,
  x1: (item.source as D3NodeEntity).x,
  y1: (item.source as D3NodeEntity).y,
  x2: (item.target as D3NodeEntity).x,
  y2: (item.target as D3NodeEntity).y
});

const REMOVED_LINE = { opacity: 0 };

const HIDDEN_NODE = (item: D3NodeEntity) => ({
  x: item.x,
  y: item.y,
  r: 0,
  opacity: 0
});

const VISIBLE_NODE = (item: D3NodeEntity) => ({
  x: item.x,
  y: item.y,
  r: item.depth > 1 ? MIN_RADIUS : MAX_RADIUS,
  opacity: 1
});

const REMOVED_NODE = { r: 0, opacity: 0 };

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
          {!isNil(d3Links) && (
            <Transition
              native
              config={CONFIG}
              items={d3Links}
              keys={LINK_KEYS}
              from={HIDDEN_LINE}
              enter={VISIBLE_LINE}
              update={VISIBLE_LINE}
              leave={REMOVED_LINE}
            >
              {d3Link => styles => (
                <animated.line
                  strokeWidth={(+(d3Link.target as D3NodeEntity).id % 4) + 1}
                  x1={styles.x1}
                  y1={styles.y1}
                  x2={styles.x2}
                  y2={styles.y2}
                  style={{ opacity: styles.opacity }}
                />
              )}
            </Transition>
          )}
        </g>
        <g className="nodes-group">
          {!isNil(d3Nodes) && (
            <Transition
              native
              config={CONFIG}
              items={d3Nodes}
              keys={NODE_KEYS}
              from={HIDDEN_NODE}
              enter={VISIBLE_NODE}
              update={VISIBLE_NODE}
              leave={REMOVED_NODE}
            >
              {d3Node => styles => {
                const commsNode = d3Node as CommunicationsNode;
                const className = classNames("node", {
                  root: d3Node.depth === 0,
                  account: d3Node.depth > 0 && commsNode.type === "account",
                  market: d3Node.depth > 0 && commsNode.type === "market",
                  selected: includes(selectedIds, d3Node.id)
                });
                return (
                  <animated.g className={className}>
                    <animated.circle
                      cx={styles.x}
                      cy={styles.y}
                      r={styles.r}
                      style={{ opacity: styles.opacity }}
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
                      <animated.text
                        x={styles.x}
                        y={styles.y}
                        dx={0}
                        dy={3}
                        style={{ opacity: styles.opacity }}
                      >
                        {commsNode.initials}
                      </animated.text>
                    )}
                  </animated.g>
                );
              }}
            </Transition>
          )}
        </g>
      </svg>
    );
  }
}

export default ReactNetworkGraphSVG;
