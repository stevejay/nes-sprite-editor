import React from "react";
import * as d3 from "d3";
import { includes } from "lodash";
// import { default as d3HeatMap, ID3HeatMap } from "./d3-heat-map";
import { DonutChartDatum } from "./types";
import { TooltipData } from "../Tooltip/types";
import { PieArcDatum } from "d3";

// https://swizec.com/blog/silky-smooth-piechart-transitions-react-d3js/swizec/8258
// https://bl.ocks.org/mbostock/5682158

function findNeighborArc(i, data0, data1, key) {
  var d;
  return (d = findPreceding(i, data0, data1, key))
    ? { startAngle: d.endAngle, endAngle: d.endAngle }
    : (d = findFollowing(i, data0, data1, key))
    ? { startAngle: d.startAngle, endAngle: d.startAngle }
    : null;
}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length,
    m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

type Props = {
  width: number;
  height: number;
  data: Array<DonutChartDatum>;
  selectedIds: Array<string>;
  coloring?: (node: DonutChartDatum, selected: boolean) => string;
  onToggleSlice: (node: DonutChartDatum) => void;
  onShowTooltip: (node: DonutChartDatum, target: TooltipData["target"]) => void;
  onHideTooltip: () => void;
};

class DonutChartChart extends React.Component<Props> {
  _container: React.RefObject<SVGSVGElement>;
  // _renderer: ID3HeatMap;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    // this._renderer = d3HeatMap()
    // .rows(props.rows)
    // .columns(props.columns);
    // if (props.coloring) {
    //   this._renderer.coloring(props.coloring);
    // }
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  // handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
  //   const eventData = this.getEventData(event.clientX, event.clientY);
  //   if (!eventData) {
  //     return;
  //   }
  //   this.props.onToggleSlice(this.props.data[eventData.index]);
  // };

  // handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
  //   const eventData = this.getEventData(event.clientX, event.clientY);
  //   if (!eventData) {
  //     return;
  //   }
  //   this.props.onShowTooltip(
  //     this.props.nodes[eventData.index],
  //     eventData.target
  //   );
  // };

  // handleMouseLeave = () => {
  //   this.props.onHideTooltip();
  // };

  // private renderGraph() {
  //   const { nodes, width, selectedIds } = this.props;
  //   if (!(width > 0) || !nodes) {
  //     return;
  //   }
  //   this._renderer.container(this._container.current!).width(width);
  //   this._renderer(nodes, selectedIds);
  // }

  private renderGraph() {
    const { width, height, data, coloring, selectedIds } = this.props;
    const color = coloring || d3.scaleOrdinal(d3.schemeCategory10);

    console.log("data", JSON.stringify(data));

    const svg = d3.select(this._container.current);
    svg.attr("width", width);
    svg.attr("height", height);

    let group = svg.selectAll<SVGGElement, object>("g.donut").data([null]);
    group = group
      .enter()
      .append("g")
      .classed("donut", true)
      // @ts-ignore
      .merge(group);
    group.attr("transform", `translate(${width * 0.5},${height * 0.5})`);

    const outerRadius = Math.min(width, height) * 0.5 - 10; // 10 is margin

    // const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3
      .arc()
      .innerRadius(outerRadius * 0.6) // Proportion
      .outerRadius(outerRadius)
      .cornerRadius(2);

    const pie = d3
      .pie<DonutChartDatum>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.015);

    function arcTween(
      d: PieArcDatum<DonutChartDatum>,
      i: number,
      nodes: ArrayLike<SVGPathElement>
    ) {
      const node = nodes[i];
      const iFunc = d3.interpolate(node._current, d);
      node._current = iFunc(0);
      return (t: number) => arc(iFunc(t));
    }

    let path = group.selectAll<SVGPathElement, any>("path.slice");

    const data0 = path.data();
    const data1 = pie(data);
    const key = d => d.data.key;
    path = path.data(data1, key);

    path
      .exit()
      .datum(function(d, i) {
        return findNeighborArc(i, data1, data0, key) || d;
      })
      .transition()
      .duration(500)
      .attrTween("d", arcTween)
      .remove();

    path = path
      .enter()
      .append("path")
      .classed("slice", true)
      .each(function(d, i) {
        this._current = findNeighborArc(i, data0, data1, key) || d;
      })
      // .attr("d", arc)
      .attr("fill", d => color(d.data, false))
      // .each(
      //   (
      //     d: PieArcDatum<DonutChartDatum>,
      //     i: number,
      //     nodes: ArrayLike<SVGPathElement>
      //   ) => {
      //     nodes[i]._current = d;
      //   }
      // )
      // @ts-ignore
      .merge(path);
    path
      .classed("selected", d => includes(selectedIds, d.data.key))
      .transition()
      .duration(500)
      // .attr("d", arc)
      .attrTween("d", arcTween);
    // .attr("fill", d => color(d.data, false));
  }

  render() {
    return (
      <svg
        ref={this._container}
        // onClick={this.handleClick}
        // onMouseMove={this.handleMouseMove}
        // onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default DonutChartChart;
