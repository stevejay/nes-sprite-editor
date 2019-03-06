import React from "react";
import * as d3 from "d3";
import { Node, Link } from "./NetworkGraph";
import { clamp, isNil, includes, random } from "lodash";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;

type NetworkGraphRenderer = {
  (
    svg: SVGSVGElement,
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIndexes: Array<number>
  ): void;
  width(value: number): number | NetworkGraphRenderer;
  height(value: number): number | NetworkGraphRenderer;
  onShowTooltipCallback(
    value: (data: Node, originRect: ClientRect) => void
  ): NetworkGraphRenderer;
  onHideTooltipCallback(value: () => void): NetworkGraphRenderer;
  onToggleNode(value: (data: Node) => void): NetworkGraphRenderer;
};

function networkGraph(): NetworkGraphRenderer {
  let width = 0;
  let height = 0;
  let onShowTooltip: null | ((data: Node, originRect: any) => void) = null;
  let onHideTooltip: null | (() => void) = null;
  let onToggleNode: null | ((data: Node) => void) = null;
  const simulation = d3.forceSimulation().stop();

  function renderer(
    svgElement: SVGSVGElement,
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIndexes: Array<number>
  ) {
    const svg = d3.select(svgElement);
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
    // .transition()
    // .attr("stroke-opacity", 0)
    // // .style("opacity", 0)
    // .attrTween("x1", function(d) {
    //   return function() {
    //     return d.source.x;
    //   };
    // })
    // .attrTween("x2", function(d) {
    //   return function() {
    //     return d.target.x;
    //   };
    // })
    // .attrTween("y1", function(d) {
    //   return function() {
    //     return d.source.y;
    //   };
    // })
    // .attrTween("y2", function(d) {
    //   return function() {
    //     return d.target.y;
    //   };
    // })

    linkElements = linkElements
      .enter()
      .append("line")
      // @ts-ignore
      .merge(linkElements);

    linkElements.attr("stroke-width", () => `${random(1, 4)}px`);

    // all nodes group:

    let nodesGroup = svg.selectAll(".nodes-group").data([null]);
    nodesGroup = nodesGroup
      .enter()
      .append("g")
      .classed("nodes-group", true)
      // @ts-ignore
      .merge(nodesGroup);

    // node groups:

    // bind:
    let nodeElements = nodesGroup
      .selectAll(".node")
      .data(nodes, function(d: any) {
        return d.id;
      });
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
      .classed("root", (d: Node) => !!d.isRoot)
      .classed("account", (d: Node) => !d.isRoot && d.type === "account")
      .classed("market", (d: Node) => !d.isRoot && d.type === "market");
    // add a circle for each entering node:
    nodeElementsEnter
      .append("circle")
      .attr("cx", width * 0.5)
      .attr("cy", height * 0.5)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);
    // add a text for each entering node that is a major node:
    nodeElementsEnter
      .filter(d => d.degree === 1 || !!d.isRoot)
      .append("text")
      .attr("x", width * 0.5)
      .attr("y", height * 0.5)
      .attr("dx", -7)
      .attr("dy", 3);
    // merge entering and updating selections:
    // @ts-ignore
    nodeElements = nodeElementsEnter.merge(nodeElements);
    nodeElements.classed(
      "selected",
      (d: Node) => !!includes(selectedIndexes, d.id)
    );
    // update the circle attributes:
    nodeElements
      .select("circle")
      .attr("r", (d: Node) =>
        d.isRoot || d.degree === 1 ? MAX_RADIUS : MIN_RADIUS
      );
    // update the text attributes:
    nodeElements.select("text").text(function(d) {
      return d.initials;
    });

    function boxingForce() {
      for (let node of nodes) {
        // If the positions exceed the box, set them to the boundary position.
        // You may want to include your nodes width to not overlap with the box.
        node.x = clamp(node.x || 0, 0 + MAX_RADIUS, width - MAX_RADIUS);
        node.y = clamp(node.y || 0, 0 + MAX_RADIUS, height - MAX_RADIUS);
      }
    }

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    simulation
      .nodes(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width * 0.5, height * 0.5))
      .force("bounds", boxingForce)
      .force("collision", d3.forceCollide().radius(() => MAX_RADIUS + 10))
      .on("tick", ticked)
      .alpha(1)
      .restart();

    function ticked() {
      linkElements
        .attr("x1", d => (d.source as Node).x || 0)
        .attr("y1", d => (d.source as Node).y || 0)
        .attr("x2", d => (d.target as Node).x || 0)
        .attr("y2", d => (d.target as Node).y || 0);
      nodeElements
        .select("circle")
        .attr("cx", d => d.x || 0)
        .attr("cy", d => d.y || 0);
      nodeElements
        .select("text")
        .attr("x", d => d.x || 0)
        .attr("y", d => d.y || 0);
    }

    function handleMouseOver(d: Node) {
      // @ts-ignore
      const boundingRect = this.getBoundingClientRect();
      onShowTooltip && onShowTooltip(d, boundingRect);
    }

    function handleMouseOut(d: Node) {
      onHideTooltip && onHideTooltip();
    }

    function handleClick(d: Node) {
      // @ts-ignore
      // this.parentNode.classList.toggle("selected");
      onToggleNode && onToggleNode(d);
    }
  }

  renderer.width = function(value?: number) {
    if (!arguments.length) {
      return width;
    }
    width = value!;
    return renderer;
  };

  renderer.height = function(value?: number) {
    if (!arguments.length) {
      return height;
    }
    height = value!;
    return renderer;
  };

  renderer.onShowTooltipCallback = function(
    value: (data: Node, originRect: any) => void
  ) {
    onShowTooltip = value;
    return renderer;
  };

  renderer.onHideTooltipCallback = function(value: () => void) {
    onHideTooltip = value;
    return renderer;
  };

  renderer.onToggleNode = function(value: (data: Node) => void) {
    onToggleNode = value;
    return renderer;
  };

  return renderer;
}

type Props = {
  nodes: Array<Node>;
  links: Array<Link>;
  selectedIndexes: Array<number>;
  width: number;
  height: number;
  onShowTooltip: (value: Node, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: Node) => void;
};

class NetworkGraphSVG extends React.PureComponent<Props> {
  _svg: React.RefObject<SVGSVGElement>;
  _renderer: NetworkGraphRenderer;

  constructor(props: Props) {
    super(props);
    this._svg = React.createRef();
    this._renderer = networkGraph();
  }

  componentDidMount() {
    this.renderSvg();
  }

  componentDidUpdate() {
    this.renderSvg();
  }

  handleShowTooltip = (data: Node, originRect: ClientRect) => {
    this.props.onShowTooltip(data, originRect);
  };

  handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  handleToggleNode = (data: Node) => {
    this.props.onToggleNode(data);
  };

  private renderSvg() {
    const { width, height, selectedIndexes, nodes, links } = this.props;
    if (!this._svg.current || !(width > 0)) {
      return;
    }
    this._renderer.width(width);
    this._renderer.height(height);
    this._renderer.onShowTooltipCallback(this.handleShowTooltip);
    this._renderer.onHideTooltipCallback(this.handleHideTooltip);
    this._renderer.onToggleNode(this.handleToggleNode);
    this._renderer(this._svg.current, nodes, links, selectedIndexes);
  }

  render() {
    return <svg ref={this._svg} />;
  }
}

export default NetworkGraphSVG;
