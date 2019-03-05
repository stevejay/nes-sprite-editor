import React from "react";
import memoizeOne from "memoize-one";
import * as d3Selection from "d3-selection";
import * as d3Force from "d3-force";
import { Node } from "./NetworkGraph";
import { clamp, isNil } from "lodash";

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

  function renderer(
    svgElement: SVGSVGElement,
    nodes: Array<Node>,
    links: Array<{ source: Node; target: Node }>
  ) {
    const svg = d3Selection.select(svgElement);
    svg.attr("width", width);
    svg.attr("height", height);

    const linkGroup = svg.selectAll(".link-group").data([null]);
    linkGroup
      .enter()
      .append("g")
      .classed("link-group", true)
      // @ts-ignore
      .merge(linkGroup);

    let linkLines = linkGroup.selectAll("line").data(links, function(d) {
      return `${d.source.id}--${d.target.id}`;
    });
    linkLines.exit().remove();
    linkLines = linkLines
      .enter()
      .append("line")
      // @ts-ignore
      .merge(linkLines);

    const nodeGroup = svg.selectAll(".node-group").data([null]);
    nodeGroup
      .enter()
      .append("g")
      .classed("node-group", true)
      // @ts-ignore
      .merge(nodeGroup);

    let nodeCircles = nodeGroup.selectAll("circle").data(nodes, function(d) {
      return d.id;
    });
    nodeCircles.exit().remove();
    nodeCircles = nodeCircles
      .enter()
      .append("circle")
      .attr("cx", width * 0.5)
      .attr("cy", height * 0.5)
      // @ts-ignore
      .merge(nodeCircles)
      .classed("root", function(d) {
        return d.isRoot;
      })
      .attr("r", function(d) {
        return 20;
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
        node.x = clamp(node.x, 0 + 20, width - 20);
        node.y = clamp(node.y, 0 + 20, height - 20);
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

    let simulation = d3Force
      .forceSimulation()
      .stop()
      .force(
        "link",
        d3Force.forceLink(links) //.distance(60)
        //.strength(0.4)
      )
      .force("charge", d3Force.forceManyBody().strength(-10))
      .force("center", d3Force.forceCenter(width * 0.5, height * 0.5))
      .force("bounds", boxingForce)
      .force(
        "collision",
        d3Force.forceCollide().radius(function(d) {
          return 20 + 10; // d.radius
        })
      )
      .on("tick", ticked);

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    simulation.nodes(nodes);
    // simulation.links(links); //.links(links);
    simulation.restart();

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
      //     return clamp(d.x, 0 + 20, width - 20); // d.x;
      //   })
      //   .attr("cy", function(d) {
      //     return clamp(d.y, 0 + 20, height - 20); // d.y;
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
    const svg = memoizeOne(() => <svg ref={this._svg} />);
    return svg();
  }
}

export default NetworkGraphSVG;
