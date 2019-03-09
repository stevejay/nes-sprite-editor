import * as d3 from "d3";
import { includes, cloneDeep } from "lodash";
import networkGraphFakeWorker from "./network-graph-fake-worker";
import {
  NodeEntity,
  LinkEntity,
  D3NodeEntity,
  D3LinkEntity,
  GetOrSet
} from "./types";

export interface INetworkGraph {
  (
    nodes: Array<NodeEntity>,
    links: Array<LinkEntity>,
    selectedIds: Array<NodeEntity["id"]>,
    recalculateNodes: boolean
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
    value: (value: NodeEntity, originRect: ClientRect) => void
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
    | ((data: NodeEntity, originRect: ClientRect) => void)
    | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: NodeEntity) => void) | null = null;
  let labelAccessor: (data: NodeEntity) => string = d => d.id;
  let _version = 0;
  let _nodes: Array<D3NodeEntity> = [];
  let _links: Array<D3LinkEntity> = [];

  function renderer(
    nodes: Array<NodeEntity>,
    links: Array<LinkEntity>,
    selectedIds: Array<NodeEntity["id"]>,
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
      _nodes = result.nodes as Array<D3NodeEntity>;
      _links = result.links as Array<D3LinkEntity>;
    }

    // create and size the container svg element:
    const svg = d3.select(svgElement);
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
      .selectAll<SVGLineElement, LinkEntity>("line")
      .data(
        _links as Array<D3LinkEntity>,
        (d: any) => `${d.source.id}--${d.target.id}`
      );
    // exit:
    linkElements.exit().remove();
    // enter:
    // linkElements = linkElements
    linkElements
      .enter()
      .append("line")
      .style("opacity", 0)
      .attr("x1", d => (d.source as D3NodeEntity).x || 0)
      .attr("y1", d => (d.source as D3NodeEntity).y || 0)
      .attr("x2", d => (d.target as D3NodeEntity).x || 0)
      .attr("y2", d => (d.target as D3NodeEntity).y || 0)
      .attr("stroke-width", (_d, index) => `${(index % 4) + 1}px`)
      .transition()
      .delay(150)
      .style("opacity", 1);
    // update:
    linkElements
      .transition()
      .attr("x1", d => (d.source as D3NodeEntity).x || 0)
      .attr("y1", d => (d.source as D3NodeEntity).y || 0)
      .attr("x2", d => (d.target as D3NodeEntity).x || 0)
      .attr("y2", d => (d.target as D3NodeEntity).y || 0)
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
      .selectAll<SVGGElement, D3NodeEntity>(".node")
      .data(_nodes as Array<D3NodeEntity>, d => d.id);
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
      .classed("root", d => !!d.isRoot)
      .classed("account", d => !d.isRoot && d.type === "account")
      .classed("market", d => !d.isRoot && d.type === "market");
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
      .filter(d => d.depth === 1 || !!d.isRoot)
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
      d => !!includes(selectedIds, d.id)
    );

    // update the circle attributes:
    enterAndUpdateNodeElements
      .select("circle")
      .transition()
      .attr("r", d => (d.isRoot || d.depth === 1 ? maxRadius : minRadius))
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0);
    // update the text attributes:
    enterAndUpdateNodeElements
      .select("text")
      .text(labelAccessor)
      .transition()
      .attr("x", d => d.x || 0)
      .attr("y", d => d.y || 0);

    function handleMouseOver(d: NodeEntity) {
      if (!!d.isRoot) {
        return;
      }
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: NodeEntity) {
      if (!!d.isRoot) {
        return;
      }
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: NodeEntity) {
      if (d.depth !== 1) {
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
    value: (data: NodeEntity, originRect: ClientRect) => void
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
