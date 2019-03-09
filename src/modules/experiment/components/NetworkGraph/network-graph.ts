import * as d3 from "d3";
import { CommunicationsNode, Link } from "./NetworkGraph";
import { includes } from "lodash";
import forceDrag from "./force-drag";
import networkGraphForceSimulation from "./network-graph-force-simulation";

export interface INetworkGraph {
  (
    nodes: Array<CommunicationsNode>,
    links: Array<Link>,
    selectedIds: Array<number>
  ): void;
  svgElement(element: SVGSVGElement): INetworkGraph;
  width(value: number): INetworkGraph;
  height(value: number): INetworkGraph;
  minRadius(value: number): INetworkGraph;
  maxRadius(value: number): INetworkGraph;
  showTooltipCallback(
    value: (data: CommunicationsNode, originRect: ClientRect) => void
  ): INetworkGraph;
  hideTooltipCallback(value: () => void): INetworkGraph;
  toggleNodeCallback(value: (data: CommunicationsNode) => void): INetworkGraph;
}

export default function networkGraph(): INetworkGraph {
  let svgElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  let minRadius = 8;
  let maxRadius = 13;
  let onShowTooltip:
    | ((data: CommunicationsNode, originRect: any) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: CommunicationsNode) => void) | null = null;
  const simulation = networkGraphForceSimulation();

  function renderer(
    nodes: Array<CommunicationsNode>,
    links: Array<Link>,
    selectedIds: Array<number>
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
      .selectAll("line")
      .data(links, (d: any) => `${d.source.id}--${d.target.id}`);
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
      .selectAll(".node")
      .data(nodes, (d: any) => d.id);
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
      .classed("root", (d: CommunicationsNode) => !!d.isRoot)
      .classed(
        "account",
        (d: CommunicationsNode) => !d.isRoot && d.type === "account"
      )
      .classed(
        "market",
        (d: CommunicationsNode) => !d.isRoot && d.type === "market"
      );
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
      .filter(d => d.degree === 1 || !!d.isRoot)
      .append("text")
      .attr("dx", 0)
      .attr("dy", 3)
      .attr("text-anchor", "middle");

    // merge entering and updating selections:
    // @ts-ignore
    nodeElements = nodeElementsEnter.merge(nodeElements);
    nodeElements.classed(
      "selected",
      (d: CommunicationsNode) => !!includes(selectedIds, d.id)
    );

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
      .attr("r", (d: CommunicationsNode) =>
        d.isRoot || d.degree === 1 ? maxRadius : minRadius
      );
    // update the text attributes:
    nodeElements.select("text").text(function(d) {
      return d.initials;
    });

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
        .attr("x1", d => (d.source as CommunicationsNode).x || 0)
        .attr("y1", d => (d.source as CommunicationsNode).y || 0)
        .attr("x2", d => (d.target as CommunicationsNode).x || 0)
        .attr("y2", d => (d.target as CommunicationsNode).y || 0);
      nodeElements
        .select("circle")
        .attr("cx", d => d.x || 0)
        .attr("cy", d => d.y || 0);
      nodeElements
        .select("text")
        .attr("x", d => d.x || 0)
        .attr("y", d => d.y || 0);
    }

    function handleMouseOver(d: CommunicationsNode, index: number) {
      if (index === 0) {
        return;
      }
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(_d: CommunicationsNode, index: number) {
      if (index === 0) {
        return;
      }
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: CommunicationsNode) {
      if (d.degree !== 1) {
        return;
      }
      onToggleNode && onToggleNode(d);
    }
  }

  renderer.svgElement = function(element: SVGSVGElement) {
    svgElement = element;
    return renderer;
  };

  renderer.width = function(value: number) {
    width = value!;
    return renderer;
  };

  renderer.height = function(value: number) {
    height = value!;
    return renderer;
  };

  renderer.minRadius = function(value: number) {
    minRadius = value!;
    return renderer;
  };

  renderer.maxRadius = function(value: number) {
    maxRadius = value!;
    return renderer;
  };

  renderer.showTooltipCallback = function(
    value: (data: CommunicationsNode, originRect: any) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(value: () => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleNodeCallback = function(
    value: (data: CommunicationsNode) => void
  ) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}
