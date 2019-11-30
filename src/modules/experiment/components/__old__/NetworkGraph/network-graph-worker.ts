import * as d3 from "d3";
import boundsForce from "./bounds-force";
import { forceManyBodyReuse } from "d3-force-reuse";
import { random } from "lodash";

onmessage = function(event) {
  const { nodes, links, width, height, maxRadius, version } = event.data;

  // fix the position of the root node to the center of the graph:
  nodes[0].fx = width * 0.5;
  nodes[0].fy = height * 0.5;

  // position the remaining nodes around the root node:
  nodes.forEach((node: any) => {
    node.x = width * 0.5 + random(-10, 10);
    node.vx = NaN;
    node.y = height * 0.5 + random(-10, 10);
    node.vy = NaN;
  });

  const simulation = d3
    .forceSimulation()
    .nodes(nodes)
    .force("link", d3.forceLink(links).id((d: any) => d.id))
    .force(
      "inner radial degree",
      d3
        .forceRadial(height * 0.2, width * 0.5, height * 0.5)
        .strength((d: any) => (d.degree === 1 ? 0.5 : 0))
    )
    .force(
      "outer radial degree",
      d3
        .forceRadial(width * 0.33, width * 0.5, height * 0.5)
        .strength((d: any) => (d.degree >= 2 ? 0.5 : 0))
    )
    .force("center", d3.forceCenter(width * 0.5, height * 0.5))
    .force("bounds", boundsForce(width, height, maxRadius))
    .force("collision", d3.forceCollide().radius(() => maxRadius + 10))
    .force("charge", forceManyBodyReuse())
    .stop();

  // var simulation = d3
  //   .forceSimulation(nodes)
  //   .force("charge", d3.forceManyBody())
  //   .force(
  //     "link",
  //     d3
  //       .forceLink(links)
  //       .distance(20)
  //       .strength(1)
  //   )
  //   .force("x", d3.forceX())
  //   .force("y", d3.forceY())
  //   .stop();

  const n = Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
  );

  for (let i = 0; i < n; ++i) {
    // postMessage({ type: "tick", progress: i / n });
    simulation.tick();
  }

  postMessage({ type: "end", nodes, links, version });
};
