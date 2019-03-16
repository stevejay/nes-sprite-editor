import * as d3 from "d3";
import { GetOrSet } from "../NetworkGraph/types";
import { HeatMapNode } from "./types";
import { includes } from "lodash";
import heatMapColoring from "./heat-map-coloring";

const MARGIN_PX = 1;

export interface ID3HeatMap {
  (nodes: Array<HeatMapNode>, selectedIds: Array<number>): void;

  container(value: SVGSVGElement): this;
  coloring(value: (node: HeatMapNode, selected: boolean) => string): this;

  width(): number;
  width(value: number): this;

  rows(): number;
  rows(value: number): this;

  columns(): number;
  columns(value: number): this;
}

export default function d3HeatMap(): ID3HeatMap {
  let container: SVGSVGElement | null = null;
  let coloring: (
    node: HeatMapNode,
    selected: boolean
  ) => string = heatMapColoring;
  let width = 0;
  let rows = 0;
  let columns = 0;
  let onShowTooltip:
    | ((data: HeatMapNode, target: ClientRect) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: HeatMapNode) => void) | null = null;

  async function renderer(
    nodes: Array<HeatMapNode>,
    selectedIds: Array<number>
  ) {
    const dimension = width / columns;
    const height = dimension * rows;

    const svg = d3.select(container);
    svg.attr("width", width);
    svg.attr("height", height);

    let tiles = svg.selectAll("rect").data(nodes, (d: any) => d.id);
    tiles = tiles
      .enter()
      .append("rect")
      .attr("x", d => (d.id % columns) * dimension + MARGIN_PX)
      .attr("y", d => Math.floor(d.id / columns) * dimension + MARGIN_PX)
      .attr("width", dimension - MARGIN_PX * 2)
      .attr("height", dimension - MARGIN_PX * 2)
      .attr("rx", MARGIN_PX * 4)
      .attr("ry", MARGIN_PX * 4)
      .attr("fill", d => coloring(d, includes(selectedIds, d.id)))
      // .attr("fill", d => `rgba(0,150,203,${clamp(d.normalisedCount, 0, 1)})`)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      // @ts-ignore
      .merge(tiles);

    tiles
      .transition()
      .attr("x", d => (d.id % columns) * dimension + MARGIN_PX)
      .attr("y", d => Math.floor(d.id / columns) * dimension + MARGIN_PX)
      .attr("width", dimension - MARGIN_PX * 2)
      .attr("height", dimension - MARGIN_PX * 2)
      .attr("fill", d => coloring(d, includes(selectedIds, d.id)));

    function handleMouseOver(d: HeatMapNode) {
      if (d.count === 0) {
        return;
      }
      // @ts-ignore
      const self = this;
      const boundingRect = self.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: HeatMapNode) {
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: HeatMapNode) {
      onToggleNode && onToggleNode(d);
    }
  }

  renderer.container = function(value: SVGSVGElement) {
    container = value;
    return renderer;
  };

  renderer.coloring = function(
    value: (node: HeatMapNode, selected: boolean) => string
  ) {
    coloring = value;
    return renderer;
  };

  renderer.width = ((value?: number): number | ID3HeatMap => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, ID3HeatMap>;

  renderer.rows = ((value?: number): number | ID3HeatMap => {
    if (typeof value !== "undefined") {
      rows = value || 0;
      return renderer;
    }
    return rows;
  }) as GetOrSet<number, ID3HeatMap>;

  renderer.columns = ((value?: number): number | ID3HeatMap => {
    if (typeof value !== "undefined") {
      columns = value || 0;
      return renderer;
    }
    return columns;
  }) as GetOrSet<number, ID3HeatMap>;

  return renderer;
}
