import * as d3 from "d3";
import { CommsSource, CommsSourceNode } from "./types";
import { GetOrSet } from "../NetworkGraph";
// import d3BasicGroup from "./d3-basic-group";

export interface ICommsDataSourceGraph {
  (selectedIds: Array<CommsSourceNode["id"]>): void;

  sources(): Array<CommsSource>;
  sources(value: Array<CommsSource>): this;

  width(): number;
  width(value: number): this;

  height(): number;
  height(value: number): this;

  showTooltipCallback(
    value: (node: CommsSourceNode, target: ClientRect) => void
  ): this;
  hideTooltipCallback(value: (node: CommsSourceNode) => void): this;
  toggleNodeCallback(value: (node: CommsSourceNode) => void): this;
}

export default function d3CommsDataSourceChart(
  svgElement: SVGSVGElement
): ICommsDataSourceGraph {
  let width = 0;
  let height = 0;
  let minRadius = 8;
  let maxRadius = 13;
  let onShowTooltip:
    | ((node: CommsSourceNode, target: ClientRect) => void)
    | null = null;
  let onHideTooltip: ((node: CommsSourceNode) => void) | null = null;
  let onToggleNode: ((node: CommsSourceNode) => void) | null = null;
  let sources: Array<CommsSource> = [];

  function renderer(selectedIds: Array<CommsSourceNode["id"]>) {
    // update the container size:
    const svg = d3
      .select<SVGElement, null>(svgElement)
      .attr("width", width)
      .attr("height", height);

    // // the links are line SVG elements that are contained in a group

    // let link = d3BasicGroup()
    //   .class("links")(svg)
    //   .selectAll<SVGLineElement, D3LinkEntity>("line")
    //   .data(links, (d: any) => `${d.source.id}--${d.target.id}`);
  }

  function handleMouseOver(d: CommsSourceNode) {
    // @ts-ignore
    const boundingRect = this.getBoundingClientRect();
    onShowTooltip && onShowTooltip(d, boundingRect);
  }

  function handleMouseOut(d: CommsSourceNode) {
    onHideTooltip && onHideTooltip(d);
  }

  function handleClick(d: CommsSourceNode) {
    onToggleNode && onToggleNode(d);
  }

  renderer.sources = ((
    value?: Array<CommsSource>
  ): Array<CommsSource> | ICommsDataSourceGraph => {
    if (typeof value !== "undefined") {
      sources = value;
      return renderer;
    }
    return sources;
  }) as GetOrSet<Array<CommsSource>, ICommsDataSourceGraph>;

  renderer.width = ((value?: number): number | ICommsDataSourceGraph => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, ICommsDataSourceGraph>;

  renderer.height = ((value?: number): number | ICommsDataSourceGraph => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return renderer;
    }
    return height;
  }) as GetOrSet<number, ICommsDataSourceGraph>;

  renderer.showTooltipCallback = function(
    value: (node: CommsSourceNode, target: ClientRect) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(
    value: (node: CommsSourceNode) => void
  ) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleNodeCallback = function(
    value: (node: CommsSourceNode) => void
  ) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}
