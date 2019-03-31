import React from "react";
import * as d3 from "d3";
import { HeatMapNode } from "./types";
import styles from "./Tile.module.scss";
import { includes } from "lodash";

const MARGIN_PX = 1;
const NO_VALUE_OPACITY = 0.075;
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;

const opacity = d3
  .scaleLinear()
  .range([MIN_OPACITY, MAX_OPACITY])
  .domain([0, 1]);

type Props = {
  width: number;
  node: HeatMapNode;
  rows: number;
  columns: number;
  selectedIds: Array<number>;
};

class Tile extends React.Component<Props> {
  _tile: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._tile = React.createRef();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.node !== this.props.node ||
      nextProps.width !== this.props.width ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  render() {
    const { width, columns, node, selectedIds } = this.props;
    const dimension = width / columns;
    const selected = includes(selectedIds, node.id);
    return (
      <div
        ref={this._tile}
        className={`${styles.rect} ${selected ? styles.selected : ""}`}
        style={{
          left: (node.id % columns) * dimension + MARGIN_PX,
          top: Math.floor(node.id / columns) * dimension + MARGIN_PX,
          width: dimension - MARGIN_PX * 2,
          height: dimension - MARGIN_PX * 2,
          opacity: selected
            ? MAX_OPACITY
            : node.count === 0
            ? NO_VALUE_OPACITY
            : opacity(node.normalisedCount)
        }}
      />
    );
  }
}

export default Tile;
