import React from "react";
import * as d3 from "d3";
import { Node, Link } from "./NetworkGraph";
import { clamp, isNil, includes, random, cloneDeep, find } from "lodash";
import boundsForce from "./bounds-force";
import forceDrag from "./force-drag";
import { forceManyBodyReuse } from "d3-force-reuse";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;

interface NetworkGraph {
  (
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIndexes: Array<number>
  ): void;
  svgElement(element: SVGSVGElement): NetworkGraph;
  width(x: number): NetworkGraph;
  height(x: number): NetworkGraph;
  showTooltipCallback(
    value: (data: Node, originRect: ClientRect) => void
  ): NetworkGraph;
  hideTooltipCallback(value: () => void): NetworkGraph;
  toggleNodeCallback(value: (data: Node) => void): NetworkGraph;
}

function networkGraph(): NetworkGraph {
  let svgElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  let onShowTooltip: ((data: Node, originRect: any) => void) | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: Node) => void) | null = null;

  const simulation = d3
    .forceSimulation()
    .stop()
    .force("collision", d3.forceCollide().radius(() => MAX_RADIUS + 10))
    .force("charge", forceManyBodyReuse());
  // .force("charge", d3.forceManyBody());

  function renderer(
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIndexes: Array<number>
  ) {
    const svg = d3.select(svgElement);
    const existingWidth = svg.attr("width");
    const existingHeight = svg.attr("height");
    svg.attr("width", width);
    svg.attr("height", height);

    const dimensionsChanging =
      +existingWidth !== width || +existingHeight !== height;
    const dataChanging = nodes !== simulation.nodes();

    if (dataChanging) {
      const currentNodes = simulation.nodes();
      nodes.forEach((node, index) => {
        node.x =
          currentNodes && currentNodes[index]
            ? currentNodes[index].x
            : width * 0.5 + random(-10, 10); // width * 0.5 + random(-10, 10);
        node.y =
          currentNodes && currentNodes[index]
            ? currentNodes[index].y
            : height * 0.5 + random(-10, 10); // height * 0.5 + random(-10, 10);
      });
    }

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
      // .attr("x", width * 0.5)
      // .attr("y", height * 0.5)
      .classed("node", true)
      .classed("root", (d: Node) => !!d.isRoot)
      .classed("account", (d: Node) => !d.isRoot && d.type === "account")
      .classed("market", (d: Node) => !d.isRoot && d.type === "market");
    // add a circle for each entering node:
    nodeElementsEnter
      .append("circle")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      // @ts-ignore
      .call(forceDrag(simulation));
    // .call(d3.drag());
    // .call(simulation.drag);
    // add a text for each entering node that is a major node:
    nodeElementsEnter
      .filter(d => d.degree === 1 || !!d.isRoot)
      .append("text")
      // .attr("x", width * 0.5)
      // .attr("y", height * 0.5)
      .attr("dx", 0)
      .attr("dy", 3)
      .attr("text-anchor", "middle");

    // merge entering and updating selections:
    // @ts-ignore
    nodeElements = nodeElementsEnter.merge(nodeElements);
    nodeElements.classed(
      "selected",
      (d: Node) => !!includes(selectedIndexes, d.id)
    );

    nodeElements
      .select("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    nodeElements
      .select("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y);

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

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    if (dimensionsChanging) {
      simulation
        .force(
          "radial degree 1",
          d3
            .forceRadial(height * 0.2, width * 0.5, height * 0.5)
            .strength((d: any) => (d.degree === 1 ? 0.5 : 0))
        )
        .force(
          "radial",
          d3
            .forceRadial(width * 0.33, width * 0.5, height * 0.5)
            .strength((d: any) => (d.degree >= 2 ? 0.5 : 0))
        )
        .force("center", d3.forceCenter(width * 0.5, height * 0.5))
        .force("bounds", boundsForce(width, height, MAX_RADIUS));
    }

    // const links = simulation.force("link").links();
    // Only restart the animation if the nodes have changed.
    if (dataChanging || dimensionsChanging) {
      simulation
        .nodes(nodes)
        .force("link", d3.forceLink<Node, Link>(links).id((d: any) => d.id));
      // .force("x", d3.forceX())
      // .force("y", d3.forceY())

      simulation
        .on("tick", ticked)
        .alpha(1)
        .restart();

      // for (
      //   var i = 0,
      //     n = Math.ceil(
      //       Math.log(simulation.alphaMin()) /
      //         Math.log(1 - simulation.alphaDecay())
      //     );
      //   i < n;
      //   ++i
      // ) {
      //   simulation.tick();
      // }
    }

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

type State = {
  nodes: Array<Node> | null;
  links: Array<Link> | null;
  d3Nodes: Array<Node> | null;
  d3Links: Array<Link> | null;
};

class NetworkGraphSVG extends React.PureComponent<Props, State> {
  _svg: React.RefObject<SVGSVGElement>;
  _renderer: NetworkGraph;

  constructor(props: Props) {
    super(props);
    this._svg = React.createRef();
    this._renderer = networkGraph()
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode);
    this.state = NetworkGraphSVG.createState(props);
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return props.nodes !== state.nodes
      ? NetworkGraphSVG.createState(props)
      : state;
  }

  static createState(props: Props) {
    return {
      nodes: props.nodes,
      links: props.links,
      d3Nodes: cloneDeep(props.nodes),
      d3Links: cloneDeep(props.links)
    };
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

  private renderGraph() {
    const { width, height, selectedIndexes } = this.props;
    const { d3Nodes, d3Links } = this.state;
    if (!(width > 0) || !(height > 0) || !d3Nodes || !d3Links) {
      return;
    }
    this._renderer
      .svgElement(this._svg.current!)
      .width(width)
      .height(height);
    this._renderer(d3Nodes, d3Links, selectedIndexes);
  }

  render() {
    return <svg ref={this._svg} />;
  }
}

export default NetworkGraphSVG;
