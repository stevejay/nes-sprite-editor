import * as d3 from "d3";

export default function drag() {
  function dragstarted(d: d3.SimulationNodeDatum) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragged(d: d3.SimulationNodeDatum) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d: d3.SimulationNodeDatum) {
    delete d.fx;
    delete d.fy;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
