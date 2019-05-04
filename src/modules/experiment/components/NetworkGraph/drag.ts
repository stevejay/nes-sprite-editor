import * as d3 from "d3";

export default function drag(render: any) {
  function dragstarted(d: d3.SimulationNodeDatum) {
    if (d.id === 0) {
      return;
    }
    // d.x = d3.event.x;
    // d.y = d3.event.y;

    // d3.select(this)
    //   .attr("cx", d3.event.x)
    //   .attr("cy", d3.event.y);

    // d.fx = d3.event.x;
    // d.fy = d3.event.y;
  }

  function dragged(d: d3.SimulationNodeDatum) {
    d.x = d3.event.x;
    d.y = d3.event.y;

    // d3.select(this)
    //   .attr("cx", d3.event.x)
    //   .attr("cy", d3.event.y);

    // d.fx = d3.event.x;
    // d.fy = d3.event.y;
  }

  function dragended(d: d3.SimulationNodeDatum) {
    // delete d.fx;
    // delete d.fy;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
    .on("start.render drag.render end.render", render);
}
