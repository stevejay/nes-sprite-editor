import * as d3 from "d3";

export default function forceDrag(
  simulation: d3.Simulation<
    d3.SimulationNodeDatum,
    d3.SimulationLinkDatum<d3.SimulationNodeDatum>
  >
) {
  function dragstarted(d: d3.SimulationNodeDatum) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d: d3.SimulationNodeDatum) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d: d3.SimulationNodeDatum) {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }
    delete d.fx;
    delete d.fy;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
