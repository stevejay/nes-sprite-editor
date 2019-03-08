function constant(x: number) {
  return function() {
    return x;
  };
}

export default function(
  x: number,
  y: number,
  radiusW: number,
  radiusH: number
) {
  var nodes,
    strength = constant(0.1),
    strengths;

  if (x == null) x = 0;
  if (y == null) y = 0;

  function force(alpha) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i];
      var dx = node.x - x || 1e-6;
      var dy = node.y - y || 1e-6;
      var r = Math.sqrt(dx * dx + dy * dy);

      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      const l = Math.sqrt(
        1 /
          (Math.pow(Math.sin(angle) / radiusW, 2) +
            Math.pow(Math.cos(angle) / radiusH, 2))
      );

      var k = /*radiuses[i]*/ ((l - r) * strengths[i] * alpha) / r;
      node.vx += dx * k;
      node.vy += dy * k;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
      n = nodes.length;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    (nodes = _), initialize();
  };

  force.strength = function(_) {
    return arguments.length
      ? ((strength = typeof _ === "function" ? _ : constant(+_)),
        initialize(),
        force)
      : strength;
  };

  force.x = function(_) {
    return arguments.length ? ((x = +_), force) : x;
  };

  force.y = function(_) {
    return arguments.length ? ((y = +_), force) : y;
  };

  return force;
}
