import * as d3 from "d3";
import { GetOrSet } from "../NetworkGraph/types";
import { HeatMapNode } from "./types";
import { includes } from "lodash";
// import heatMapColoring from "./heat-map-coloring";

const MARGIN_PX = 1;

export interface ID3HeatMapHtml {
  (nodes: Array<HeatMapNode>, selectedIds: Array<number>): void;

  container(value: HTMLDivElement): this;
  // coloring(value: (node: HeatMapNode, selected: boolean) => string): this;

  width(): number;
  width(value: number): this;

  rows(): number;
  rows(value: number): this;

  columns(): number;
  columns(value: number): this;
}

const NO_VALUE_OPACITY = 0.075;
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;

const opacity = d3
  .scaleLinear()
  .range([MIN_OPACITY, MAX_OPACITY])
  .domain([0, 1]);

export default function d3HeatMapHtml(): ID3HeatMapHtml {
  let container: HTMLDivElement | null = null;
  // let coloring: (
  //   node: HeatMapNode,
  //   selected: boolean
  // ) => string = heatMapColoring;
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

    const div = d3
      .select(container)
      .style("width", width + "px")
      .style("height", height + "px");

    let tiles = div.selectAll(".rect").data(nodes, (d: any) => d.id);

    tiles = tiles
      .enter()
      .append("div")
      .classed("rect", true)
      .style("left", d => (d.id % columns) * dimension + MARGIN_PX + "px")
      .style(
        "top",
        d => Math.floor(d.id / columns) * dimension + MARGIN_PX + "px"
      )
      .style("width", dimension - MARGIN_PX * 2 + "px")
      .style("height", dimension - MARGIN_PX * 2 + "px")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      // @ts-ignore
      .merge(tiles);

    tiles
      // .transition()
      .style("opacity", d => {
        if (includes(selectedIds, d.id)) {
          return MAX_OPACITY;
        }
        if (d.count === 0) {
          return NO_VALUE_OPACITY;
        }
        return opacity(d.normalisedCount);
      })
      .classed("selected", d => includes(selectedIds, d.id));

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

  renderer.container = function(value: HTMLDivElement) {
    container = value;
    return renderer;
  };

  // renderer.coloring = function(
  //   value: (node: HeatMapNode, selected: boolean) => string
  // ) {
  //   coloring = value;
  //   return renderer;
  // };

  renderer.width = ((value?: number): number | ID3HeatMapHtml => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, ID3HeatMapHtml>;

  renderer.rows = ((value?: number): number | ID3HeatMapHtml => {
    if (typeof value !== "undefined") {
      rows = value || 0;
      return renderer;
    }
    return rows;
  }) as GetOrSet<number, ID3HeatMapHtml>;

  renderer.columns = ((value?: number): number | ID3HeatMapHtml => {
    if (typeof value !== "undefined") {
      columns = value || 0;
      return renderer;
    }
    return columns;
  }) as GetOrSet<number, ID3HeatMapHtml>;

  return renderer;
}
