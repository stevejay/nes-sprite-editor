import React from "react";
import * as d3 from "d3";
import { Node, Link } from "./NetworkGraph";
import { clamp, isNil, includes, random, cloneDeep, find } from "lodash";
import boundsForce from "./bounds-force";
import forceDrag from "./force-drag";
import { forceManyBodyReuse } from "d3-force-reuse";

interface NetworkGraph {
  (
    nodes: Array<Node>,
    links: Array<Link>,
    selectedIndexes: Array<number>
  ): void;
  svgElement(element: SVGSVGElement): NetworkGraph;
  width(value: number): NetworkGraph;
  height(value: number): NetworkGraph;
  minRadius(value: number): NetworkGraph;
  maxRadius(value: number): NetworkGraph;
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
  let minRadius = 8;
  let maxRadius = 13;
  let onShowTooltip: ((data: Node, originRect: any) => void) | null = null;
  let onHideTooltip: (() => void) | null = null;
  let onToggleNode: ((data: Node) => void) | null = null;
  const simulation = d3.forceSimulation().stop();

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

    const currentNodes = simulation.nodes();
    // const currentLinks = simulation.force("link").links();
    const dataChanging = nodes !== currentNodes;

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
      (d: Node) => !!includes(selectedIndexes, d.id)
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
      .attr("r", (d: Node) =>
        d.isRoot || d.degree === 1 ? maxRadius : minRadius
      );
    // update the text attributes:
    nodeElements.select("text").text(function(d) {
      return d.initials;
    });

    // --- data ---

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    if (dataChanging || dimensionsChanging) {
      if (dataChanging) {
        nodes.forEach((node, index) => {
          node.x =
            currentNodes && currentNodes[index]
              ? (currentNodes[index] as Node).x
              : width * 0.5 + random(-10, 10);
          node.vx = NaN;
          node.y =
            currentNodes && currentNodes[index]
              ? (currentNodes[index] as Node).y
              : height * 0.5 + random(-10, 10);
          node.vy = NaN;
        });
      }

      simulation
        .nodes(nodes)
        .force("link", d3.forceLink<Node, Link>(links).id((d: any) => d.id))
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
        .force("bounds", boundsForce(width, height, maxRadius))
        .force("collision", d3.forceCollide().radius(() => maxRadius + 10))
        .force("charge", forceManyBodyReuse())
        // .force("charge", d3.forceManyBody());
        .on("tick", ticked)
        .alpha(1)
        .restart();
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
