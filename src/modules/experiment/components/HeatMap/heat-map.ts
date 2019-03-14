import * as d3 from "d3";
import { GetOrSet } from "../NetworkGraph/types";
import { HeatMapNode } from "./types";
import { includes, clamp } from "lodash";

const MARGIN_PX = 1;
const NO_VALUE_OPACITY = 0.075;
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;

export interface IHeatMap {
  (nodes: Array<HeatMapNode>, selectedIds: Array<number>): void;

  containerElement(element: SVGSVGElement): this;

  width(): number;
  width(value: number): this;

  rows(): number;
  rows(value: number): this;

  columns(): number;
  columns(value: number): this;

  showTooltipCallback(
    value: (value: HeatMapNode, originRect: ClientRect) => void
  ): this;
  hideTooltipCallback(value: () => void): this;
  toggleNodeCallback(value: (value: HeatMapNode) => void): this;
}

export default function heatMap(): IHeatMap {
  let containerElement: SVGSVGElement | null = null;
  let width = 0;
  let rows = 0;
  let columns = 0;
  let onShowTooltip:
    | ((data: HeatMapNode, originRect: ClientRect) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: HeatMapNode) => void) | null = null;
  const opacity = d3
    .scaleLinear()
    .range([MIN_OPACITY, MAX_OPACITY])
    .domain([0, 1]);

  async function renderer(
    nodes: Array<HeatMapNode>,
    selectedIds: Array<number>
  ) {
    const dimension = width / columns;
    const height = dimension * rows;

    const container = d3.select(containerElement);
    container.attr("width", width);
    container.attr("height", height);

    let tiles = container.selectAll("rect").data(nodes, d => d.id);
    tiles = tiles
      .enter()
      .append("rect")
      .attr("x", d => (d.id % columns) * dimension + MARGIN_PX)
      .attr("y", d => Math.floor(d.id / columns) * dimension + MARGIN_PX)
      .attr("width", dimension - MARGIN_PX * 2)
      .attr("height", dimension - MARGIN_PX * 2)
      .attr("rx", MARGIN_PX * 4)
      .attr("ry", MARGIN_PX * 4)
      .attr("fill", d => `rgba(0,150,203,${clamp(d.normalisedCount, 0, 1)})`)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      // @ts-ignore
      .merge(tiles);

    tiles
      .transition()
      .attr("fill", d =>
        includes(selectedIds, d.id)
          ? "#00cb8e"
          : `rgba(0,150,203,${
              d.count === 0 ? NO_VALUE_OPACITY : opacity(d.normalisedCount)
            })`
      );

    function handleMouseOver(d: HeatMapNode) {
      if (d.count === 0) {
        return;
      }
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: HeatMapNode) {
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: HeatMapNode) {
      onToggleNode && onToggleNode(d);
    }
  }

  renderer.containerElement = function(element: SVGSVGElement) {
    containerElement = element;
    return renderer;
  };

  renderer.width = ((value?: number): number | IHeatMap => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, IHeatMap>;

  renderer.rows = ((value?: number): number | IHeatMap => {
    if (typeof value !== "undefined") {
      rows = value || 0;
      return renderer;
    }
    return rows;
  }) as GetOrSet<number, IHeatMap>;

  renderer.columns = ((value?: number): number | IHeatMap => {
    if (typeof value !== "undefined") {
      columns = value || 0;
      return renderer;
    }
    return columns;
  }) as GetOrSet<number, IHeatMap>;

  renderer.showTooltipCallback = function(
    value: (data: HeatMapNode, originRect: ClientRect) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(value: () => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleNodeCallback = function(value: (data: HeatMapNode) => void) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}
