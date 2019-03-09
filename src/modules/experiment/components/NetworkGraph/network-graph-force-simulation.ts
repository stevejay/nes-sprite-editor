import * as d3 from "d3";
import { random } from "lodash";
import boundsForce from "./bounds-force";
import forceEllipsis from "./force-ellipsis";
import { forceManyBodyReuse } from "d3-force-reuse";
import { D3NodeEntity, D3LinkEntity, GetOrSet } from "./types";

interface IForceSimulation {
  (
    width: number,
    height: number,
    dimensionsChanged: boolean,
    nodes: Array<D3NodeEntity>,
    links: Array<D3LinkEntity>,
    ticked: any
  ): void;

  handle(): d3.Simulation<{}, undefined>;

  minRadius(): number;
  minRadius(value: number): this;

  maxRadius(): number;
  maxRadius(value: number): this;
}

export default function networkGraphForceSimulation(): IForceSimulation {
  const forceSimulation = d3.forceSimulation().stop();
  let minRadius = 0;
  let maxRadius = 0;

  function simulation(
    width: number,
    height: number,
    dimensionsChanged: boolean,
    nodes: Array<D3NodeEntity>,
    links: Array<D3LinkEntity>,
    ticked: any
  ) {
    const currentNodes = forceSimulation.nodes() as Array<D3NodeEntity>;
    const dataChanged = nodes !== currentNodes;

    nodes[0].fx = width * 0.5;
    nodes[0].fy = height * 0.5;

    if (dataChanged || dimensionsChanged) {
      if (dataChanged) {
        nodes.forEach((node, index) => {
          node.x =
            currentNodes && currentNodes[index]
              ? currentNodes[index].x
              : width * 0.5 + random(-10, 10);
          node.vx = NaN;
          node.y =
            currentNodes && currentNodes[index]
              ? currentNodes[index].y
              : height * 0.5 + random(-10, 10);
          node.vy = NaN;
        });
      }

      forceSimulation
        .nodes(nodes)
        .force(
          "link",
          d3.forceLink<D3NodeEntity, D3LinkEntity>(links).id(d => d.id)
        )
        .force(
          "radial depth 1",
          d3
            .forceRadial<D3NodeEntity>(height * 0.2, width * 0.5, height * 0.5)
            .strength(d => (d.degree === 1 ? 0.5 : 0))
        )
        .force(
          "ellipsis depth 2+",
          forceEllipsis<D3NodeEntity>(
            width * 0.5,
            height * 0.5,
            width * 0.45,
            height * 0.45
          ).strength(d =>
            (d.degree || 0) >= 2 ? 0.25 + (d.degree || 0) * 0.1 : 0
          )
        )
        .force("center", d3.forceCenter(width * 0.5, height * 0.5))
        .force("bounds", boundsForce(width, height, maxRadius))
        .force("collision", d3.forceCollide().radius(() => maxRadius + 10))
        .force("charge", forceManyBodyReuse())
        .on("tick", ticked)
        .alpha(1)
        .restart();
    }
  }

  simulation.handle = function() {
    return forceSimulation;
  };

  simulation.minRadius = ((value?: number): number | IForceSimulation => {
    if (typeof value !== "undefined") {
      minRadius = value || 0;
      return simulation;
    }
    return minRadius;
  }) as GetOrSet<number, IForceSimulation>;

  simulation.maxRadius = ((value?: number): number | IForceSimulation => {
    if (typeof value !== "undefined") {
      maxRadius = value || 0;
      return simulation;
    }
    return maxRadius;
  }) as GetOrSet<number, IForceSimulation>;

  return simulation;
}
