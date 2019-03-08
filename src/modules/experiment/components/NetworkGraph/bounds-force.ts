import { isNil, clamp } from "lodash";

interface BoundsForce {
  (): void;
  initialize(nodes: any): void;
  width(): number;
  width(x: number): BoundsForce;
  height(): number;
  height(x: number): BoundsForce;
  maxNodeRadius(): number;
  maxNodeRadius(x: number): BoundsForce;
}

export default function(
  width: number,
  height: number,
  maxNodeRadius: number
): BoundsForce {
  let nodes: any = null;

  if (isNil(width)) {
    width = 0;
  }

  if (isNil(height)) {
    height = 0;
  }

  if (isNil(maxNodeRadius)) {
    maxNodeRadius = 0;
  }

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

  force.initialize = function(_nodes: any) {
    nodes = _nodes;
  };

  force.width = function(value?: number) {
    return arguments.length ? ((width = +(value || 0)), force) : width;
  };

  force.height = function(value?: number) {
    return arguments.length ? ((height = +(value || 0)), force) : height;
  };

  force.maxNodeRadius = function(value?: number) {
    return arguments.length
      ? ((maxNodeRadius = +(value || 0)), force)
      : maxNodeRadius;
  };

  return force as BoundsForce;
}
