import { clamp } from "lodash";
import * as d3 from "d3";

type GetOrSet<ValueT, ThisT> = {
  (): ValueT;
  (value: ValueT): ThisT;
};

interface BoundsForce<NodeT extends d3.SimulationNodeDatum> {
  (): void;
  initialize(nodes: Array<NodeT>): void;
  width(): number;
  width(value: number): this;
  height(): number;
  height(value: number): this;
  maxNodeRadius(): number;
  maxNodeRadius(value: number): this;
}

export default function<NodeT extends d3.SimulationNodeDatum>(
  width: number,
  height: number,
  maxNodeRadius: number
): BoundsForce<NodeT> {
  let nodes: Array<NodeT> = [];

  function force() {
    for (let i = 0; i < nodes.length; ++i) {
      // If the positions exceed the box, set them to the boundary position.
      nodes[i].x = clamp(nodes[i].x || 0, maxNodeRadius, width - maxNodeRadius);
      nodes[i].y = clamp(
        nodes[i].y || 0,
        maxNodeRadius,
        height - maxNodeRadius
      );
    }
  }

  force.initialize = function(newNodes: Array<NodeT>) {
    nodes = newNodes;
  };

  force.width = ((value?: number): number | BoundsForce<NodeT> => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return force;
    }
    return width;
  }) as GetOrSet<number, BoundsForce<NodeT>>;

  force.height = ((value?: number): number | BoundsForce<NodeT> => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return force;
    }
    return height;
  }) as GetOrSet<number, BoundsForce<NodeT>>;

  force.maxNodeRadius = ((value?: number): number | BoundsForce<NodeT> => {
    if (typeof value !== "undefined") {
      maxNodeRadius = value || 0;
      return force;
    }
    return maxNodeRadius;
  }) as GetOrSet<number, BoundsForce<NodeT>>;

  return force;
}
