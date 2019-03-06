import React from "react";
// import memoizeOne from "memoize-one";
import * as d3 from "d3";
import { Node, Link } from "./NetworkGraph";
import { clamp, isNil } from "lodash";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;

type NetworkGraphRenderer = {
  (svg: SVGSVGElement, nodes: Array<Node>, links: Array<Link>): void;
  width(value: number): number | NetworkGraphRenderer;
  height(value: number): number | NetworkGraphRenderer;
};

function networkGraph(): NetworkGraphRenderer {
  let width = 0;
  let height = 0;
  const simulation = d3.forceSimulation().stop();

  function renderer(
    svgElement: SVGSVGElement,
    nodes: Array<Node>,
    links: Array<Link>
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

    let nodesGroup = svg.selectAll(".nodes-group").data([null]);
    nodesGroup = nodesGroup
      .enter()
      .append("g")
      .classed("nodes-group", true)
      // @ts-ignore
      .merge(nodesGroup);

    let nodeElements = nodesGroup
      .selectAll("circle")
      .data(nodes, function(d: any) {
        return d.id;
      });

    nodeElements
      .exit()
      .transition()
      .attr("r", 0)
      .remove();

    nodeElements = nodeElements
      .enter()
      .append("circle")
      // .attr("fill", function(d) { return color(d.id); }) <<< do
      // .call(function(node) {
      //   node.transition().attr("r", function(d) {
      //     return d.isRoot || d.degree === 1 ? MAX_RADIUS : MIN_RADIUS;
      //   });
      // })
      .attr("cx", width * 0.5)
      .attr("cy", height * 0.5)
      // @ts-ignore
      .merge(nodeElements)
      .classed("root", (d: Node) => d.isRoot)
      .classed("account", (d: Node) => !d.isRoot && d.type === "account")
      .classed("market", (d: Node) => !d.isRoot && d.type === "market")
      .attr("r", (d: Node) =>
        d.isRoot || d.degree === 1 ? MAX_RADIUS : MIN_RADIUS
      );

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
      nodeElements.attr("cx", d => d.x || 0).attr("cy", d => d.y || 0);

      // nodeElements.attr("cx", function(d) {
      //   console.log("this", this);
      // });
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

  return renderer;
}

type Props = {
  nodes: Array<Node>;
  links: Array<Link>;
  width: number;
  height: number;
};

class NetworkGraphSVG extends React.Component<Props> {
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

  private renderSvg() {
    const { width, height } = this.props;
    const { nodes, links } = this.props;
    if (!this._svg.current || isNil(width) || width <= 0) {
      return;
    }
    this._renderer.width(width);
    this._renderer.height(height);
    this._renderer(this._svg.current, nodes, links);
  }

  render() {
    return <svg ref={this._svg} />;
    // prevent React from changing the svg or its content:
    // const memoizedSvg = memoizeOne(() => <svg ref={this._svg} />);
    // return memoizedSvg();
  }
}

export default NetworkGraphSVG;
