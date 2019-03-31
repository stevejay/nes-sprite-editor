import React from "react";
import { HeatMapNode } from "./types";
import { TooltipData } from "../Tooltip/types";
import Tile from "./Tile";
import styles from "./HeatMapHtmlChart.module.scss";

type Props = {
  width: number;
  nodes: Array<HeatMapNode>;
  rows: number;
  columns: number;
  selectedIds: Array<number>;
  coloring?: (node: HeatMapNode, selected: boolean) => string;
  onToggleNode: (node: HeatMapNode) => void;
  onShowTooltip: (node: HeatMapNode, target: TooltipData["target"]) => void;
  onHideTooltip: () => void;
};

class HeatMapHtmlChart extends React.Component<Props> {
  _container: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.width !== this.props.width ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventData = this.getEventData(event.clientX, event.clientY);
    if (!eventData) {
      return;
    }
    this.props.onToggleNode(this.props.nodes[eventData.index]);
  };

  handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventData = this.getEventData(event.clientX, event.clientY);
    if (!eventData) {
      return;
    }
    this.props.onShowTooltip(
      this.props.nodes[eventData.index],
      eventData.target
    );
  };

  handleMouseLeave = () => {
    this.props.onHideTooltip();
  };

  getEventData(clientX: number, clientY: number) {
    const { rows, columns } = this.props;
    const boundingRect = this._container!.current!.getBoundingClientRect();
    const yInContainer = clientY - boundingRect.top;
    const xInContainer = clientX - boundingRect.left;
    const dimension = boundingRect.width / columns;
    const row = Math.floor(yInContainer / dimension);
    const column = Math.floor(xInContainer / dimension);
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      return null;
    }
    return {
      index: row * columns + column,
      target: {
        top: row * dimension + boundingRect.top,
        left: column * dimension + boundingRect.left,
        width: dimension,
        height: dimension
      }
    };
  }

  render() {
    const { width, rows, columns, nodes, selectedIds } = this.props;
    const dimension = width / columns;
    const height = dimension * rows;
    return (
      <div
        ref={this._container}
        style={{ width, height }}
        className={styles.container}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      >
        {nodes.map(node => (
          <Tile
            key={node.id}
            width={width}
            node={node}
            rows={rows}
            columns={columns}
            selectedIds={selectedIds}
          />
        ))}
      </div>
    );
  }
}

export default HeatMapHtmlChart;
