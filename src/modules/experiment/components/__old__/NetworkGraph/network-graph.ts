import * as d3 from "d3";
import { includes } from "lodash";
import forceDrag from "./___force-drag";
import networkGraphForceSimulation from "../__old__/NetworkGraph/network-graph-force-simulation";
import {
  GetOrSet,
  NodeEntity,
  LinkEntity,
  D3NodeEntity,
  D3LinkEntity
} from "./types";

export interface INetworkGraph {
  (
    nodes: Array<NodeEntity>,
    links: Array<LinkEntity>,
    selectedIds: Array<NodeEntity["id"]>
  ): void;

  svgElement(element: SVGSVGElement): this;

  width(): number;
  width(value: number): this;

  height(): number;
  height(value: number): this;

  minRadius(): number;
  minRadius(value: number): this;

  maxRadius(): number;
  maxRadius(value: number): this;

  showTooltipCallback(
    value: (value: NodeEntity, target: ClientRect) => void
  ): this;
  hideTooltipCallback(value: () => void): this;
  toggleNodeCallback(value: (value: NodeEntity) => void): this;
  labelAccessor(value: (value: NodeEntity) => string): this;
}

export default function networkGraph(): INetworkGraph {
  let svgElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  let minRadius = 8;
  let maxRadius = 13;
  let onShowTooltip:
    | ((data: NodeEntity, target: ClientRect) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: NodeEntity) => void) | null = null;
  let labelAccessor: (data: NodeEntity) => string = d => d.id;
  const simulation = networkGraphForceSimulation();

  function renderer(
    nodes: Array<NodeEntity>,
    links: Array<LinkEntity>,
    selectedIds: Array<NodeEntity["id"]>
  ) {
    const svg = d3.select(svgElement);
    const existingWidth = svg.attr("width");
    const existingHeight = svg.attr("height");
    svg.attr("width", width);
    svg.attr("height", height);

    let linksGroup = svg.selectAll(".links-group").data([null]);
    linksGroup = linksGroup
      .enter()
      .append("g")
      .classed("links-group", true)
      // @ts-ignore
      .merge(linksGroup);

    let linkElements = linksGroup
      .selectAll<SVGLineElement, LinkEntity>("line")
      .data(
        links as Array<D3LinkEntity>,
        (d: any) => `${d.source.id}--${d.target.id}`
      );
    linkElements.exit().remove();
    linkElements = linkElements
      .enter()
      .append("line")
      // @ts-ignore
      .merge(linkElements);

    linkElements.attr("stroke-width", (_d, index) => `${(index % 4) + 1}px`);

    // all nodes group:

    let nodesGroup = svg.selectAll(".nodes-group").data([null]);
    nodesGroup = nodesGroup
      .enter()
      .append("g")
      .classed("nodes-group", true)
      // @ts-ignore
      .merge(nodesGroup);

    // node groups:

    let nodeElements = nodesGroup
      .selectAll<SVGGElement, D3NodeEntity>(".node")
      .data(nodes as Array<D3NodeEntity>, d => d.id);
    // remove the exiting nodes:
    const nodeElementsExit = nodeElements.exit();
    nodeElementsExit.transition().remove();
    // remove the circle for each exiting node:
    nodeElementsExit
      .select("circle")
      .transition()
      .attr("r", 0)
      .remove();
    // remove the text elements
    nodeElementsExit.select("text").remove();
    // add the entering nodes:
    const nodeElementsEnter = nodeElements
      .enter()
      .append("g")
      .classed("node", true)
      .classed("root", d => d.depth === 0)
      .classed("account", d => d.depth > 0 && d.type === "account")
      .classed("market", d => d.depth > 0 && d.type === "market");
    // add a circle for each entering node:
    nodeElementsEnter
      .append("circle")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      // @ts-ignore
      .call(forceDrag(simulation.handle()));
    // add a text for each entering node that is a major node:
    nodeElementsEnter
      .filter(d => d.depth <= 1)
      .append("text")
      .attr("dx", 0)
      .attr("dy", 3)
      .attr("text-anchor", "middle");

    // merge entering and updating selections:
    // @ts-ignore
    nodeElements = nodeElementsEnter.merge(nodeElements);
    nodeElements.classed("selected", d => !!includes(selectedIds, d.id));

    nodeElements
      .select("circle")
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0);

    nodeElements
      .select("text")
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0);

    // update the circle attributes:
    nodeElements
      .select("circle")
      .attr("r", (d: NodeEntity) => (d.depth <= 1 ? maxRadius : minRadius));
    // update the text attributes:
    nodeElements.select("text").text(labelAccessor);

    simulation.minRadius(minRadius).maxRadius(maxRadius);
    simulation(
      width,
      height,
      +existingWidth !== width || +existingHeight !== height,
      nodes,
      links,
      ticked
    );

    function ticked() {
      linkElements
        .attr("x1", d => (d.source as D3NodeEntity).x || 0)
        .attr("y1", d => (d.source as D3NodeEntity).y || 0)
        .attr("x2", d => (d.target as D3NodeEntity).x || 0)
        .attr("y2", d => (d.target as D3NodeEntity).y || 0);
      nodeElements
        .select("circle")
        .attr("cx", d => d.x || 0)
        .attr("cy", d => d.y || 0);
      nodeElements
        .select("text")
        .attr("x", d => d.x || 0)
        .attr("y", d => d.y || 0);
    }

    function handleMouseOver(d: NodeEntity) {
      if (d.depth === 0) {
        return;
      }
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: NodeEntity) {
      if (d.depth === 0) {
        return;
      }
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: NodeEntity) {
      if (d.depth !== 1) {
        // TODO something like d.selectable?
        return;
      }
      onToggleNode && onToggleNode(d);
    }
  }

  renderer.svgElement = function(element: SVGSVGElement) {
    svgElement = element;
    return renderer;
  };

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
    value: (data: NodeEntity, target: ClientRect) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(value: () => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleNodeCallback = function(value: (data: NodeEntity) => void) {
    onToggleNode = value;
    return renderer;
  };

  renderer.labelAccessor = function(value: (value: NodeEntity) => string) {
    labelAccessor = value;
    return renderer;
  };

  return renderer;
}
