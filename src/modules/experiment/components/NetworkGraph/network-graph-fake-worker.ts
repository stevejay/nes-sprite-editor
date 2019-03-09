import * as d3 from "d3";
import boundsForce from "./bounds-force";
import forceEllipsis from "./force-ellipsis";
import { forceManyBodyReuse } from "d3-force-reuse";
import { forceContainer } from "d3-force-container";
import { random } from "lodash";
import {
  D3NodeEntity,
  D3LinkEntity,
  SimulationWorkerResult,
  SimulationWorkerEvent
} from "./types";

export default function(event: SimulationWorkerEvent): SimulationWorkerResult {
  const { width, height, maxRadius, version } = event.data;
  const nodes = event.data.nodes; // as Array<NodeT & d3.SimulationNodeDatum>;
  const links = event.data.links;
  //  as Array<
  //   LinkT & d3.SimulationLinkDatum<d3.SimulationNodeDatum>
  // >;

  // fix the position of the root node to the center of the graph:
  nodes[0].fx = width * 0.5;
  nodes[0].fy = height * 0.5;

  // position the remaining nodes around the root node:
  nodes.forEach((node: d3.SimulationNodeDatum) => {
    node.x = width * 0.5 + random(-10, 10);
    node.vx = NaN;
    node.y = height * 0.5 + random(-10, 10);
    node.vy = NaN;
  });

  // TRY THIS:
  // .force("container", forceContainer([[10, 10],[890, 490]]))
  // instead of boundsForce

  const simulation = d3
    .forceSimulation()
    .nodes(nodes)
    .force(
      "link",
      d3.forceLink<D3NodeEntity, D3LinkEntity>(links).id(d => d.id)
    )
    // .force(
    //   "inner radial degree",
    //   d3
    //     .forceRadial<D3NodeEntity>(height * 0.2, width * 0.5, height * 0.5)
    //     .strength(d => (d.degree === 1 ? 0.5 : 0))
    // )
    // .force(
    //   "outer radial degree",
    //   d3
    //     .forceRadial<D3NodeEntity>(width * 0.33, width * 0.5, height * 0.5)
    //     .strength(d => ((d.degree || 0) >= 2 ? 0.5 : 0))
    // )
    .force(
      "radial depth 1",
      d3
        .forceRadial<D3NodeEntity>(height * 0.2, width * 0.5, height * 0.5)
        .strength(d => (d.depth === 1 ? 0.5 : 0))
    )
    .force(
      "ellipsis depth 2+",
      forceEllipsis<D3NodeEntity>(
        width * 0.5,
        height * 0.5,
        width * 0.45,
        height * 0.45
      ).strength(d => ((d.depth || 0) >= 2 ? 0.25 + (d.depth || 0) * 0.1 : 0))
    )
    .force("center", d3.forceCenter(width * 0.5, height * 0.5))
    .force("bounds", boundsForce(width, height, maxRadius))
    .force(
      "container",
      forceContainer([
        [maxRadius, maxRadius],
        [width - maxRadius, height - maxRadius]
      ])
    )
    .force("collision", d3.forceCollide().radius(() => maxRadius + 10))
    .force("charge", forceManyBodyReuse())
    .stop();

  const n = Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
  );

  for (let i = 0; i < n; ++i) {
    // postMessage({ type: "tick", progress: i / n });
    simulation.tick();
  }

  return { type: "end", nodes, links, version };
}
