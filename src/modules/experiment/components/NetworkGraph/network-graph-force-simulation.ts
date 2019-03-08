import * as d3 from "d3";
import { Node, Link } from "./NetworkGraph";
import { random } from "lodash";
import boundsForce from "./bounds-force";
import { forceManyBodyReuse } from "d3-force-reuse";

export default function networkGraphForceSimulation() {
  const simulation = d3.forceSimulation().stop();
  let minRadius = 0;
  let maxRadius = 0;

  function my(
    width: number,
    height: number,
    dimensionsChanged: boolean,
    nodes: Array<Node>,
    links: Array<Link>,
    ticked: any
  ) {
    const currentNodes = simulation.nodes();
    // const currentLinks = simulation.force("link").links();
    const dataChanged = nodes !== currentNodes;

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    if (dataChanged || dimensionsChanged) {
      if (dataChanged) {
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
  }

  my.handle = function() {
    return simulation;
  };

  my.minRadius = function(value: number) {
    minRadius = value!;
    return my;
  };

  my.maxRadius = function(value: number) {
    maxRadius = value!;
    return my;
  };

  return my;
}
