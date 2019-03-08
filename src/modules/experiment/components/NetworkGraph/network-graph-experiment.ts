import * as d3 from "d3";
import { Node, Link } from "./NetworkGraph";
import { includes, cloneDeep } from "lodash";
import forceDrag from "./force-drag";
import networkGraphForceSimulation from "./network-graph-force-simulation";
import networkGraphFakeWorker from "./network-graph-fake-worker";

export interface INetworkGraph {
  (
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIds: Array<number>,
    recalculateNodes: boolean
  ): void;
  svgElement(element: SVGSVGElement): INetworkGraph;
  width(value: number): INetworkGraph;
  height(value: number): INetworkGraph;
  minRadius(value: number): INetworkGraph;
  maxRadius(value: number): INetworkGraph;
  showTooltipCallback(
    value: (data: Node, originRect: ClientRect) => void
  ): INetworkGraph;
  hideTooltipCallback(value: () => void): INetworkGraph;
  toggleNodeCallback(value: (data: Node) => void): INetworkGraph;
}

export default function networkGraph(): INetworkGraph {
  let svgElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  let minRadius = 8;
  let maxRadius = 13;
  let onShowTooltip: ((data: Node, originRect: any) => void) | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: Node) => void) | null = null;
  let _version = 0;
  let _nodes: Array<Node> = [];
  let _links: Array<Link> = [];

  function renderer(
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIds: Array<number>,
    recalculateNodes: boolean
  ) {
    // calculate new nodes and links data if the node or area info is changing:
    if (recalculateNodes) {
      _version = Date.now();
      const event = {
        data: {
          nodes: cloneDeep(nodes),
          links: cloneDeep(links),
          width,
          height,
          maxRadius,
          version: _version
        }
      };
      const result = networkGraphFakeWorker(event);
      _nodes = result.nodes;
      _links = result.links;
    }

    // create and size the container svg element:
    const svg = d3.select(svgElement);
    // const existingWidth = svg.attr("width");
    // const existingHeight = svg.attr("height");
    svg.attr("width", width);
    svg.attr("height", height);

    // create a group to contain all the links, so they are all located behind the nodes:
    let linksGroup = svg.selectAll(".links-group").data([null]);
    linksGroup = linksGroup
      .enter()
      .append("g")
      .classed("links-group", true)
      // @ts-ignore
      .merge(linksGroup);

    // general update pattern for the lines that are the links:
    let linkElements = linksGroup
      .selectAll("line")
      .data(_links, (d: any) => `${d.source.id}--${d.target.id}`);
    // exit:
    linkElements.exit().remove();
    // enter:
    // linkElements = linkElements
    linkElements
      .enter()
      .append("line")
      .style("opacity", 0)
      .attr("x1", d => (d.source as Node).x || 0)
      .attr("y1", d => (d.source as Node).y || 0)
      .attr("x2", d => (d.target as Node).x || 0)
      .attr("y2", d => (d.target as Node).y || 0)
      .attr("stroke-width", (_d, index) => `${(index % 4) + 1}px`)
      .transition()
      .delay(150)
      .style("opacity", 1);
    // @ts-ignore
    // .merge(linkElements);
    // update:
    linkElements
      .transition()
      // .delay(250)
      // .style("opacity", 1)
      .attr("x1", d => (d.source as Node).x || 0)
      .attr("y1", d => (d.source as Node).y || 0)
      .attr("x2", d => (d.target as Node).x || 0)
      .attr("y2", d => (d.target as Node).y || 0)
      .attr("stroke-width", (_d, index) => `${(index % 4) + 1}px`);

    // create a group to contain all the nodes:
    let nodesGroup = svg.selectAll(".nodes-group").data([null]);
    nodesGroup = nodesGroup
      .enter()
      .append("g")
      .classed("nodes-group", true)
      // @ts-ignore
      .merge(nodesGroup);

    // for each node, create a group that contains a circle and a text:
    let nodeElements = nodesGroup
      .selectAll(".node")
      .data(_nodes, (d: any) => d.id);
    const nodeElementsExit = nodeElements.exit();
    // remove the exiting node groups:
    nodeElementsExit.transition().remove();
    // remove the circle in each exiting node group:
    nodeElementsExit
      .select("circle")
      .transition()
      .attr("r", 0)
      .remove();
    // remove the text element in each exiting node group:
    nodeElementsExit.select("text").remove();

    // add the group for the entering node groups:
    const nodeElementsEnter = nodeElements
      .enter()
      .append("g")
      .classed("node", true)
      .classed("root", (d: Node) => !!d.isRoot)
      .classed("account", (d: Node) => !d.isRoot && d.type === "account")
      .classed("market", (d: Node) => !d.isRoot && d.type === "market");
    // add a circle within each entering node group:
    nodeElementsEnter
      .append("circle")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      // @ts-ignore
      // .call(forceDrag(simulation.handle()))
      .attr("r", 0)
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0);
    // add a text element for each entering node group for a major node:
    nodeElementsEnter
      .filter(d => d.degree === 1 || !!d.isRoot)
      .append("text")
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0)
      .attr("dx", 0)
      .attr("dy", 3)
      .attr("text-anchor", "middle");

    // merge entering and updating selections:
    // @ts-ignore
    const enterAndUpdateNodeElements = nodeElementsEnter.merge(nodeElements);
    enterAndUpdateNodeElements.classed(
      "selected",
      (d: Node) => !!includes(selectedIds, d.id)
    );

    // enterAndUpdateNodeElements
    //   .select("circle")
    //   .attr("cx", d => d.x || 0)
    //   .attr("cy", d => d.y || 0);

    // enterAndUpdateNodeElements
    //   .select("text")
    //   .attr("x", d => d.x || 0)
    //   .attr("y", d => d.y || 0);

    // update the circle attributes:
    enterAndUpdateNodeElements
      .select("circle")
      .transition()
      .attr("r", (d: Node) =>
        d.isRoot || d.degree === 1 ? maxRadius : minRadius
      )
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0);
    // update the text attributes:
    enterAndUpdateNodeElements
      .select("text")
      .text(function(d) {
        return d.initials;
      })
      .transition()
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0);

    function handleMouseOver(d: Node, index: number) {
      if (index === 0) {
        return;
      }
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(_d: Node, index: number) {
      if (index === 0) {
        return;
      }
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: Node) {
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
    value: (data: Node, originRect: any) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.hideTooltipCallback = function(value: () => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.toggleNodeCallback = function(value: (data: Node) => void) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}
