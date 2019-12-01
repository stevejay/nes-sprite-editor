import * as d3 from "d3";

// https://bost.ocks.org/mike/d3-plugin/ Let's make a plugin
// https://bl.ocks.org/mbostock/1134768
// https://github.com/d3/d3-shape/blob/v1.3.7/README.md#stack

type Datum = {
  date: Date;
  disease: number;
  wounds: number;
  other: number;
};

function stackedBarChart() {
  let width = 0;
  let height = 0;
  let marginLeft = 0;
  let marginTop = 0;
  const x = d3.scaleBand<Date>().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([height, 0]);
  const z = d3.scaleOrdinal(d3.schemeCategory10);

  function stackedBarChart(context: any, data: Array<Datum>) {
    x.rangeRound([0, width]);
    y.rangeRound([height, 0]);

    const stack = d3
      .stack<Datum>()
      .keys(["wounds", "other", "disease"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
    const layers = stack(data);

    x.domain(data.map(d => d.date));
    y.domain([
      0,
      d3.max(layers[layers.length - 1], d => d[0] + d[1]) || 0
    ]).nice();

    // x.domain(data.map(d => d.date.toDateString()));
    // y.domain([0, d3.max(layers[layers.length - 1], d => d[0] + d[1])]).nice();

    const selection = context.selection ? context.selection() : context;

    let g = d3
      .select(selection)
      .selectAll<SVGGElement, null>("g.chart")
      .data([null]);

    g = g
      .enter()
      .append("g")
      .classed("chart", true)
      .merge(g);

    g.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

    var layer = g
      .selectAll(".layer")
      .data(layers)
      .enter()
      .append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) {
        return z(i);
      });

    layer
      .selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.data.date);
      })
      .attr("y", function(d) {
        return y(d[1]);
      })
      .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth());
  }

  stackedBarChart.width = function(_: number) {
    return arguments.length ? ((width = _), stackedBarChart) : width;
  };

  stackedBarChart.height = function(_: number) {
    return arguments.length ? ((height = _), stackedBarChart) : height;
  };

  stackedBarChart.marginLeft = function(_: number) {
    return arguments.length ? ((marginLeft = _), stackedBarChart) : marginLeft;
  };

  stackedBarChart.marginTop = function(_: number) {
    return arguments.length ? ((marginTop = _), stackedBarChart) : marginTop;
  };

  return stackedBarChart;
}

export { stackedBarChart };
