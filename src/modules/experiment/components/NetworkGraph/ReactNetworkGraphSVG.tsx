import React from "react";
import styles from "./NetworkGraphSVG.module.scss";
import { NodeEntity, LinkEntity, D3NodeEntity, D3LinkEntity } from "./types";
import { cloneDeep, isNil, includes } from "lodash";
import { Transition, animated } from "react-spring/renderprops";
import networkGraphFakeWorkerAsync from "./network-graph-fake-worker-async";
import classNames from "classnames";
import { CommunicationsNode } from "./NetworkGraph";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;

const HIDDEN_LINE = item => ({
  opacity: 0,
  x1: (item.source as D3NodeEntity).x,
  y1: (item.source as D3NodeEntity).y,
  x2: (item.target as D3NodeEntity).x,
  y2: (item.target as D3NodeEntity).y
});

const VISIBLE_LINE = item => ({
  opacity: 1,
  x1: (item.source as D3NodeEntity).x,
  y1: (item.source as D3NodeEntity).y,
  x2: (item.target as D3NodeEntity).x,
  y2: (item.target as D3NodeEntity).y
});

const HIDDEN_NODE = item => ({
  x: (item as D3NodeEntity).x,
  y: (item as D3NodeEntity).y
});

const VISIBLE_NODE = item => ({
  x: (item as D3NodeEntity).x,
  y: (item as D3NodeEntity).y
});

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
              // unique
              native
              config={{ duration: 300 }}
              items={d3Links}
              keys={item => `${item.source.id}--${item.target.id}`}
              initial={HIDDEN_LINE}
              from={HIDDEN_LINE}
              enter={VISIBLE_LINE}
              leave={HIDDEN_LINE}
              update={VISIBLE_LINE}
            >
              {d3Link => transProps => {
                const source = d3Link.source as D3NodeEntity;
                const target = d3Link.target as D3NodeEntity;
                return (
                  <animated.line
                    // key={`${source.id}--${target.id}`}
                    strokeWidth={`${(+target.id % 4) + 1}px`}
                    x1={transProps.x1}
                    y1={transProps.y1}
                    x2={transProps.x2}
                    y2={transProps.y2}
                    style={{ opacity: transProps.opacity }}
                  />
                );
              }}
            </Transition>
          )}
        </g>
        <g className="nodes-group">
          {!isNil(d3Nodes) && (
            <Transition
              // native
              // unique
              config={{ duration: 300 }}
              items={d3Nodes}
              keys={item => item.id}
              initial={HIDDEN_NODE}
              from={HIDDEN_NODE}
              enter={VISIBLE_NODE}
              leave={HIDDEN_NODE}
              update={VISIBLE_NODE}
            >
              {d3Node => transProps => {
                const commsNode = d3Node as CommunicationsNode;
                const className = classNames("node", {
                  root: d3Node.depth === 0,
                  account: d3Node.depth > 0 && commsNode.type === "account",
                  market: d3Node.depth > 0 && commsNode.type === "market",
                  selected: includes(selectedIds, d3Node.id)
                });
                return (
                  <g
                    // key={d3Node.id}
                    className={className}
                  >
                    <circle
                      cx={transProps.x}
                      cy={transProps.y}
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
                      <text x={transProps.x} y={transProps.y} dx={0} dy={3}>
                        {commsNode.initials}
                      </text>
                    )}
                  </g>
                );
              }}
            </Transition>
          )}
        </g>
      </svg>
    );
  }
}

// d3Links.map((d3Link, index) => {
//   const source = d3Link.source as D3NodeEntity;
//   const target = d3Link.target as D3NodeEntity;
//   return (
//     <line
//       key={`${source.id}--${target.id}`}
//       strokeWidth={`${(index % 4) + 1}px`}
//       x1={source.x}
//       y1={source.y}
//       x2={target.x}
//       y2={target.y}
//     />
//   );
// })}

// d3Nodes.map(d3Node => {
//   const commsNode = d3Node as CommunicationsNode;
//   const className = classNames("node", {
//     root: d3Node.depth === 0,
//     account: d3Node.depth > 0 && commsNode.type === "account",
//     market: d3Node.depth > 0 && commsNode.type === "market",
//     selected: includes(selectedIds, d3Node.id)
//   });
//   return (
//     <g key={d3Node.id} className={className}>
//       <circle
//         cx={d3Node.x}
//         cy={d3Node.y}
//         r={d3Node.depth > 1 ? MIN_RADIUS : MAX_RADIUS}
//         onClick={
//           d3Node.depth === 1
//             ? event => this.handleClick(event, d3Node)
//             : undefined
//         }
//         onMouseOver={
//           d3Node.depth > 0
//             ? event => this.handleMouseOver(event, d3Node)
//             : undefined
//         }
//         onMouseOut={
//           d3Node.depth > 0 ? this.handleMouseOut : undefined
//         }
//       />
//       {d3Node.depth <= 1 && (
//         <text x={d3Node.x} y={d3Node.y} dx={0} dy={3}>
//           {commsNode.initials}
//         </text>
//       )}
//     </g>
//   );
// })}

export default ReactNetworkGraphSVG;
