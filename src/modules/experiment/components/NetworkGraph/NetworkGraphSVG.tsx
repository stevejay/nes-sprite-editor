import React from "react";
import memoizeOne from "memoize-one";
import * as d3 from "d3";
import { Node } from "./NetworkGraph";
import { clamp, isNil } from "lodash";

const MIN_RADIUS = 8;
const MAX_RADIUS = 13;

type NetworkGraphRenderer = {
  (
    svg: SVGSVGElement,
    nodes: Array<Node>,
    links: Array<{ source: Node; target: Node }>
  ): void;
  width(value: number): number | NetworkGraphRenderer;
  height(value: number): number | NetworkGraphRenderer;
};

function networkGraph(): NetworkGraphRenderer {
  let width = 0;
  let height = 0;
  // .force("link", d3Force.forceLink())
  // .force("charge", d3Force.forceManyBody())
  // .force("center", d3Force.forceCenter(width / 2, height / 2))
  // .on("tick", ticked)
  // .stop();

  let simulation = d3.forceSimulation().stop();

  function renderer(
    svgElement: SVGSVGElement,
    nodes: Array<Node>,
    links: Array<{ source: Node; target: Node }>
  ) {
    const svg = d3.select(svgElement);
    svg.attr("width", width);
    svg.attr("height", height);

    let linkGroup = svg.selectAll(".link-group").data([null]);
    linkGroup = linkGroup
      .enter()
      .append("g")
      .classed("link-group", true)
      // @ts-ignore
      .merge(linkGroup);

    let linkLines = linkGroup.selectAll("line").data(links, function(d) {
      return `${d.source.id}--${d.target.id}`;
    });
    linkLines
      .exit()
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
      .remove();

    linkLines = linkLines
      .enter()
      .append("line")
      // @ts-ignore
      .merge(linkLines);

    let nodeGroup = svg.selectAll(".node-group").data([null]);
    nodeGroup = nodeGroup
      .enter()
      .append("g")
      .classed("node-group", true)
      // @ts-ignore
      .merge(nodeGroup);

    let nodeCircles = nodeGroup.selectAll("circle").data(nodes, function(d) {
      return d.id;
    });
    nodeCircles
      .exit()
      .transition()
      // .attr("fill-opacity", 0)
      // .style("opacity", 0)
      .attr("r", 0)
      .remove();
    nodeCircles = nodeCircles
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
      .merge(nodeCircles)
      .classed("root", function(d) {
        return d.isRoot;
      })
      .classed("account", function(d) {
        return !d.isRoot && d.type === "account";
      })
      .classed("market", function(d) {
        return !d.isRoot && d.type === "market";
      })
      .attr("r", function(d) {
        return d.isRoot || d.degree === 1 ? MAX_RADIUS : MIN_RADIUS;
      });

    // const simulation = d3Force.force()
    // .gravity(.05)
    // .distance(100)
    // .charge(-100)
    // .size([width, height]);

    function boxingForce() {
      for (let node of nodes) {
        // Of the positions exceed the box, set them to the boundary position.
        // You may want to include your nodes width to not overlap with the box.
        node.x = clamp(node.x, 0 + MAX_RADIUS, width - MAX_RADIUS);
        node.y = clamp(node.y, 0 + MAX_RADIUS, height - MAX_RADIUS);
      }
    }

    /* alternative: Force paramettring
    var force = d3.layout.force()
    .charge(-80)
    .linkDistance(25)
    .linkStrength(0.2)
    .size([w, h])
    .nodes(nodes)
    .links(links)
    .start();
    */

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    // let simulation = d3
    //   .forceSimulation()
    //   .stop()

    simulation
      .nodes(nodes)
      .force(
        "link",
        d3.forceLink(links).id(x => x.id) //.distance(60)
        //.strength(0.4)
      )
      .force("charge", d3.forceManyBody()) //.strength(0))
      .force("center", d3.forceCenter(width * 0.5, height * 0.5))
      .force("bounds", boxingForce)
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return MAX_RADIUS + 10; // d.radius
        })
      )
      .on("tick", ticked)
      .alpha(1)
      .restart();

    function ticked() {
      linkLines
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      // nodeCircles
      //   .attr("cx", function(d) {
      //     return clamp(d.x, 0 + MAX_RADIUS, width - MAX_RADIUS); // d.x;
      //   })
      //   .attr("cy", function(d) {
      //     return clamp(d.y, 0 + MAX_RADIUS, height - MAX_RADIUS); // d.y;
      //   });

      nodeCircles
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });
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
  links: Array<{ source: Node; target: Node }>;
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
    if (!this._svg.current || isNil(width) || width <= 0) {
      return;
    }

    this._renderer.width(width);
    this._renderer.height(height);
    this._renderer(this._svg.current, this.props.nodes, this.props.links);
  }

  render() {
    // prevent React from changing the svg or its content:
    const memoizedSvg = memoizeOne(() => <svg ref={this._svg} />);
    return memoizedSvg();
  }
}

export default NetworkGraphSVG;
