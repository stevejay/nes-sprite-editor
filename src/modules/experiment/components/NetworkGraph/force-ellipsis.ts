import { constant } from "lodash";
import * as d3 from "d3";
import { ValueFunction, GetOrSet } from "./types";

interface IForceEllipsis<NodeT extends d3.SimulationNodeDatum> {
  (alpha: number): void;
  initialize(nodes: Array<NodeT>): void;

  strength(): number | ValueFunction<number, NodeT>;
  strength(value: number | ValueFunction<number, NodeT>): this;

  x(): number;
  x(value: number): this;

  y(): number;
  y(value: number): this;

  radiusX(): number;
  radiusX(value: number): this;

  radiusY(): number;
  radiusY(value: number): this;
}

export default function<NodeT extends d3.SimulationNodeDatum>(
  x: number,
  y: number,
  radiusX: number,
  radiusY: number
): IForceEllipsis<NodeT> {
  let nodes: Array<NodeT> = [];
  let strength: ValueFunction<number, NodeT> = constant(0.1);
  let strengths: Array<number> = [];

  function force(alpha: number) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      const node = nodes[i];
      const dx = (node.x || 0) - x || 1e-6;
      const dy = (node.y || 0) - y || 1e-6;
      const r = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      const l = Math.sqrt(
        1 /
          (Math.pow(Math.sin(angle) / radiusX, 2) +
            Math.pow(Math.cos(angle) / radiusY, 2))
      );
      const k = ((l - r) * strengths[i] * alpha) / r;
      node.vx = (node.vx || 0) + dx * k;
      node.vy = (node.vy || 0) + dy * k;
    }
  }

  function initialize() {
    if (!nodes) {
      return;
    }
    const n = nodes.length;
    strengths = new Array(n);
    for (let i = 0; i < n; ++i) {
      strengths[i] = +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = (newNodes: Array<NodeT>) => {
    nodes = newNodes;
    initialize();
  };

  force.strength = ((
    value?: number | ValueFunction<number, NodeT>
  ): number | ValueFunction<number, NodeT> | IForceEllipsis<NodeT> => {
    if (typeof value === "number") {
      strength = constant(value || 0);
      initialize();
      return force;
    } else if (typeof value === "function") {
      strength = value;
      initialize();
      return force;
    }
    return strength;
  }) as GetOrSet<ValueFunction<number, NodeT>, IForceEllipsis<NodeT>>;

  force.x = ((value?: number): number | IForceEllipsis<NodeT> => {
    if (typeof value !== "undefined") {
      x = value || 0;
      return force;
    }
    return x;
  }) as GetOrSet<number, IForceEllipsis<NodeT>>;

  force.y = ((value?: number): number | IForceEllipsis<NodeT> => {
    if (typeof value !== "undefined") {
      y = value || 0;
      return force;
    }
    return y;
  }) as GetOrSet<number, IForceEllipsis<NodeT>>;

  force.radiusX = ((value?: number): number | IForceEllipsis<NodeT> => {
    if (typeof value !== "undefined") {
      radiusX = value || 0;
      return force;
    }
    return radiusX;
  }) as GetOrSet<number, IForceEllipsis<NodeT>>;

  force.radiusY = ((value?: number): number | IForceEllipsis<NodeT> => {
    if (typeof value !== "undefined") {
      radiusY = value || 0;
      return force;
    }
    return radiusY;
  }) as GetOrSet<number, IForceEllipsis<NodeT>>;

  return force;
}
