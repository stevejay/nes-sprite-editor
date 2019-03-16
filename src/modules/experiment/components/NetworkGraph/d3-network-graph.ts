import * as d3 from "d3";
import { includes, noop } from "lodash";
import { NodeEntity, D3NodeEntity, D3LinkEntity, GetOrSet } from "./types";
import d3BasicGroup from "./d3-basic-group";

export interface INetworkGraph {
  (selectedIds: Array<NodeEntity["id"]>): void;

  updateNodes(
    func: (selection: d3.Selection<SVGGElement, D3NodeEntity, any, any>) => void
  ): this;

  updateNodeCircles(
    func: (
      selection:
        | d3.Selection<SVGCircleElement, D3NodeEntity, any, any>
        | d3.Transition<SVGCircleElement, D3NodeEntity, any, any>
    ) => void
  ): this;

  updateNodeLabels(
    func: (
      selection:
        | d3.Selection<SVGTextElement, D3NodeEntity, any, any>
        | d3.Transition<SVGTextElement, D3NodeEntity, any, any>
    ) => void
  ): this;

  updateLinks(
    func: (
      selection:
        | d3.Selection<SVGLineElement, D3LinkEntity, any, any>
        | d3.Transition<SVGLineElement, D3LinkEntity, any, any>
    ) => void
  ): this;

  nodes(): Array<D3NodeEntity>;
  nodes(value: Array<D3NodeEntity>): this;

  links(): Array<D3LinkEntity>;
  links(value: Array<D3LinkEntity>): this;

  width(): number;
  width(value: number): this;

  height(): number;
  height(value: number): this;

  minRadius(): number;
  minRadius(value: number): this;

  maxRadius(): number;
  maxRadius(value: number): this;

  showTooltipCallback(
    value: (node: NodeEntity, target: ClientRect) => void
  ): this;
  hideTooltipCallback(value: (node: NodeEntity) => void): this;
  toggleNodeCallback(value: (node: NodeEntity) => void): this;
}

export default function d3NetworkGraph(
  svgElement: SVGSVGElement
): INetworkGraph {
  let updateNodes: (
    selection: d3.Selection<SVGGElement, D3NodeEntity, any, any>
  ) => void = noop;
  let updateNodeCircles: (
    selection:
      | d3.Selection<SVGCircleElement, D3NodeEntity, any, any>
      | d3.Transition<SVGCircleElement, D3NodeEntity, any, any>
  ) => void = noop;
  let updateNodeLabels: (
    selection:
      | d3.Selection<SVGTextElement, D3NodeEntity, any, any>
      | d3.Transition<SVGTextElement, D3NodeEntity, any, any>
  ) => void = noop;
  let updateLinks: (
    selection:
      | d3.Selection<SVGLineElement, D3LinkEntity, any, any>
      | d3.Transition<SVGLineElement, D3LinkEntity, any, any>
  ) => void = noop;
  let width = 0;
  let height = 0;
  let minRadius = 8;
  let maxRadius = 13;
  let onShowTooltip:
    | ((node: NodeEntity, target: ClientRect) => void)
    | null = null;
  let onHideTooltip: ((node: NodeEntity) => void) | null = null;
  let onToggleNode: ((node: NodeEntity) => void) | null = null;
  let nodes: Array<D3NodeEntity> = [];
  let links: Array<D3LinkEntity> = [];

  function renderer(selectedIds: Array<NodeEntity["id"]>) {
    // update the container size:
    const svg = d3
      .select<SVGElement, null>(svgElement)
      .attr("width", width)
      .attr("height", height);

    // the links are line SVG elements that are contained in a group

    let link = d3BasicGroup()
      .class("links")(svg)
      .selectAll<SVGLineElement, D3LinkEntity>("line")
      .data(links, (d: any) => `${d.source.id}--${d.target.id}`);

    link
      .exit()
      .transition()
      .duration(100)
      .style("opacity", 1e-6)
      .remove();

    link
      .enter()
      .append("line")
      .style("opacity", 1e-6)
      .call(updateLinks)
      .transition()
      .delay(150)
      .style("opacity", 1);

    link
      .transition()
      .style("opacity", 1)
      .call(updateLinks);

    // The nodes are each a group element that contains a circle and a text.
    // The nodes are contained in a group so they sit above the links.

    let node = d3BasicGroup()
      .class("nodes")(svg)
      .selectAll<SVGGElement, D3NodeEntity>(".node")
      .data(nodes as Array<D3NodeEntity>, d => d.id);

    const nodeExitSelection = node.exit();

    // remove the exiting node groups:
    nodeExitSelection.transition().remove();
    // remove the circle in each exiting node group:
    nodeExitSelection
      .select("circle")
      .transition()
      .style("opacity", 1e-6)
      .attr("r", 0)
      .remove();
    // remove the text element in each exiting node group:
    nodeExitSelection.select("text").remove();

    // add the group for the entering node groups:
    const nodeEnterSelection = node
      .enter()
      .append("g")
      .classed("node", true);

    // add a circle within each entering node group:
    nodeEnterSelection
      .append("circle")
      .attr("r", 0)
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);
    // @ts-ignore
    // .call(drag());

    // add a text element for each entering node group for a major node:
    nodeEnterSelection
      .append("text")
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0)
      .attr("dx", 0)
      .attr("dy", 3)
      .attr("text-anchor", "middle");

    // merge entering and updating selections:
    // @ts-ignore
    const nodeUpdateSelection = nodeEnterSelection.merge(node);

    nodeUpdateSelection
      .classed("selected", d => !!includes(selectedIds, d.id))
      .call(updateNodes);

    // update the circle attributes:
    nodeUpdateSelection
      .select<SVGCircleElement>("circle")
      .transition()
      .call(updateNodeCircles)
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0);

    // update the text attributes:
    nodeUpdateSelection
      .select<SVGTextElement>("text")
      .call(updateNodeLabels)
      .transition()
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0);
  }

  function handleMouseOver(d: NodeEntity) {
    // @ts-ignore
    const boundingRect = this.getBoundingClientRect();
    onShowTooltip && onShowTooltip(d, boundingRect);
  }

  function handleMouseOut(d: NodeEntity) {
    onHideTooltip && onHideTooltip(d);
  }

  function handleClick(d: NodeEntity) {
    onToggleNode && onToggleNode(d);
  }

  renderer.updateNodes = function(
    func: (selection: d3.Selection<SVGGElement, D3NodeEntity, any, any>) => void
  ) {
    updateNodes = func;
    return renderer;
  };

  renderer.updateNodeCircles = function(
    func: (
      selection:
        | d3.Selection<SVGCircleElement, D3NodeEntity, any, any>
        | d3.Transition<SVGCircleElement, D3NodeEntity, any, any>
    ) => void
  ) {
    updateNodeCircles = func;
    return renderer;
  };

  renderer.updateNodeLabels = function(
    func: (
      selection:
        | d3.Selection<SVGTextElement, D3NodeEntity, any, any>
        | d3.Transition<SVGTextElement, D3NodeEntity, any, any>
    ) => void
  ) {
    updateNodeLabels = func;
    return renderer;
  };

  renderer.updateLinks = function(
    func: (
      selection:
        | d3.Selection<SVGLineElement, D3LinkEntity, any, any>
        | d3.Transition<SVGLineElement, D3LinkEntity, any, any>
    ) => void
  ) {
    updateLinks = func;
    return renderer;
  };

  renderer.nodes = ((
    value?: Array<D3NodeEntity>
  ): Array<D3NodeEntity> | INetworkGraph => {
    if (typeof value !== "undefined") {
      nodes = value;
      return renderer;
    }
    return nodes;
  }) as GetOrSet<Array<D3NodeEntity>, INetworkGraph>;

  renderer.links = ((
    value?: Array<D3LinkEntity>
  ): Array<D3LinkEntity> | INetworkGraph => {
    if (typeof value !== "undefined") {
      links = value;
      return renderer;
    }
    return links;
  }) as GetOrSet<Array<D3LinkEntity>, INetworkGraph>;

  renderer.width = ((value?: number): number | INetworkGraph => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, INetworkGraph>;

  renderer.height = ((value?: number): number | INetworkGraph => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return renderer;
    }
    return height;
  }) as GetOrSet<number, INetworkGraph>;

  renderer.minRadius = ((value?: number): number | INetworkGraph => {
    if (typeof value !== "undefined") {
      minRadius = value || 0;
      return renderer;
    }
    return minRadius;
  }) as GetOrSet<number, INetworkGraph>;

  renderer.maxRadius = ((value?: number): number | INetworkGraph => {
    if (typeof value !== "undefined") {
      maxRadius = value || 0;
      return renderer;
    }
    return maxRadius;
  }) as GetOrSet<number, INetworkGraph>;

  renderer.showTooltipCallback = function(
    value: (node: NodeEntity, target: ClientRect) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(value: (node: NodeEntity) => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleNodeCallback = function(value: (node: NodeEntity) => void) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}
