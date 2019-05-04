import * as d3 from "d3";
import { CommsSourceNode, Margin } from "./types";
import { GetOrSet } from "../NetworkGraph";
import { max, uniqBy, sortBy } from "lodash";
import measureText from "./measure-text";

const MIN_CIRCLE_RADIUS_PX = 5;
const MAX_CIRCLE_RADIUS_PX = 14;
const FONT_SIZE_PX = 12;
const Y_AXIS_PADDING_PX = 10;

export interface ICommsDataSourceGraph {
  (): Margin;

  nodes(): Array<CommsSourceNode>;
  nodes(value: Array<CommsSourceNode>): this;

  width(): number;
  width(value: number): this;

  height(): number;
  height(value: number): this;
}

export default function d3CommsDataSourceChart(
  svgElement: SVGSVGElement
): ICommsDataSourceGraph {
  let width = 0;
  let height = 0;
  let nodes: Array<CommsSourceNode> = [];

  function renderer(): Margin {
    const uniqueSources = sortBy(
      uniqBy(nodes, source => source.sourceId),
      node => node.sourceName
    );

    const svg = d3
      .select<SVGElement, null>(svgElement)
      .attr("width", width)
      .attr("height", height);

    const yAxisLabelWidth =
      max(
        uniqueSources.map(
          d => measureText(d.sourceName, "sans-serif", FONT_SIZE_PX).width
        )
      ) || 0;

    const maxXValue = max(nodes.map(node => node.value)) || 1;

    const xAxisLabelMetrics = measureText(
      maxXValue.toString(),
      "sans-serif",
      FONT_SIZE_PX
    );

    const margin = {
      bottom: FONT_SIZE_PX + 10,
      top: 1,
      left: yAxisLabelWidth + Y_AXIS_PADDING_PX + 1, // Extra 1px for safety
      right: Math.floor(xAxisLabelMetrics.width * 0.5) + 5
      // TODO why do I need the +5?
    };

    const y = d3
      .scaleBand()
      .domain(uniqueSources.map(d => d.sourceName))
      .range([margin.top, height - margin.bottom]);

    const yAxis = (
      g: d3.Selection<any, any, any, any> | d3.Transition<any, any, any, any>
    ) =>
      g.call(
        d3
          .axisLeft(y)
          .tickSize(0)
          .tickPadding(Y_AXIS_PADDING_PX)
      );

    let gYAxis = svg.selectAll("g.y-axis").data([null]);
    gYAxis
      .enter()
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .classed("y-axis", true)
      .style("opacity", 1e6)
      .call(yAxis);
    gYAxis
      .transition()
      .call(yAxis)
      .style("opacity", 1)
      .attr("transform", `translate(${margin.left},0)`);

    const x = d3
      .scaleLinear()
      .domain([0, maxXValue])
      .nice()
      .range([
        MIN_CIRCLE_RADIUS_PX,
        width -
          margin.right -
          margin.left -
          MIN_CIRCLE_RADIUS_PX -
          MAX_CIRCLE_RADIUS_PX
      ]);

    const xAxis = (
      g: d3.Selection<any, any, any, any> | d3.Transition<any, any, any, any>
    ) => g.call(d3.axisBottom(x));

    let gXAxis = svg.selectAll("g.x-axis").data([null]);
    gXAxis
      .enter()
      .append("g")
      .classed("x-axis", true)
      .attr(
        "transform",
        `translate(${margin.left + MIN_CIRCLE_RADIUS_PX},${height -
          margin.bottom})`
      )
      .style("opacity", 1e6)
      .call(xAxis);
    gXAxis
      .transition()
      .call(xAxis)
      .style("opacity", 1)
      .attr(
        "transform",
        `translate(${margin.left + MIN_CIRCLE_RADIUS_PX},${height -
          margin.bottom})`
      );

    let chartGroup = svg.selectAll("g.chart").data([null]);
    chartGroup = chartGroup
      .enter()
      .append("g")
      .classed("chart", true)
      .attr(
        "transform",
        `translate(${margin.left + MIN_CIRCLE_RADIUS_PX},${margin.top})`
      )
      // @ts-ignore
      .merge(chartGroup);
    chartGroup
      .transition()
      .attr(
        "transform",
        `translate(${margin.left + MIN_CIRCLE_RADIUS_PX},${margin.top})`
      );

    let domain = chartGroup.selectAll("polyline.newDomain").data([null]);
    domain = domain
      .enter()
      .append("polyline")
      .classed("newDomain", true)
      // @ts-ignore
      .merge(domain);
    domain
      .transition()
      .attr(
        "points",
        `${width - margin.right - margin.left} ${
          margin.top
        }, ${-MIN_CIRCLE_RADIUS_PX} ${
          margin.top
        }, ${-MIN_CIRCLE_RADIUS_PX} ${height -
          margin.top -
          margin.bottom}, ${width - margin.right - margin.left} ${height -
          margin.top -
          margin.bottom}`
      );

    return margin;
  }

  renderer.nodes = ((
    value?: Array<CommsSourceNode>
  ): Array<CommsSourceNode> | ICommsDataSourceGraph => {
    if (typeof value !== "undefined") {
      nodes = value;
      return renderer;
    }
    return nodes;
  }) as GetOrSet<Array<CommsSourceNode>, ICommsDataSourceGraph>;

  renderer.width = ((value?: number): number | ICommsDataSourceGraph => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, ICommsDataSourceGraph>;

  renderer.height = ((value?: number): number | ICommsDataSourceGraph => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return renderer;
    }
    return height;
  }) as GetOrSet<number, ICommsDataSourceGraph>;

  return renderer;
}
