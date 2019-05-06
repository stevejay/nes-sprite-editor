import React from "react";
import * as d3 from "d3";
import { includes } from "lodash";
import { DonutChartDatum } from "./types";
import { TooltipData } from "../Tooltip/types";
import { PieArcDatum } from "d3";

// https://swizec.com/blog/silky-smooth-piechart-transitions-react-d3js/swizec/8258
// https://bl.ocks.org/mbostock/5682158
// http://bl.ocks.org/dbuezas/9306799

const DURATION_MS = 750;
const MARGIN_PX = 10;
const MIN_LABEL_WIDTH_PX = 120;
const INNER_SLICE_RADIUS_PERCENT = 0.6;
const OUTER_SLICE_RADIUS_PERCENT = 0.9;
const LABEL_RADIUS_PERCENT = 1;
const EXTRA_LINE_LENGTH_PX = 0;
const TEXT_TO_LINE_PADDING_PX = 5;

// var colourScale = d3.scaleOrdinal()
//   .domain(['N/A', 'Disagree', 'Neither Agree nor Disagree', 'Agree'])
//   .range(["#222", "hsla(0, 60%, 50%, 1)", "hsla(45, 70%, 60%, 1)", "hsla(90, 50%, 50%, 1)"]);

function findArc(i: number, data0, data1, order) {
  const d = data0[i];
  const dOrder = order(d);

  if (!data1.length) {
    return { startAngle: 0, endAngle: 0 };
  }

  for (let i = 0; i < data1.length; ++i) {
    if (order(data1[i]) > dOrder) {
      // REPLACE!!!
      if (i === 0) {
        return { startAngle: 0, endAngle: 0 };
      } else {
        const d = data1[i - 1];
        return { startAngle: d.endAngle, endAngle: d.endAngle };
      }
    }
  }

  return { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
}

function findExitingArc(i: number, data0, data1, order) {
  return findArc(i, data0, data1, order);
  // const exitD = data0[i];
  // const exitDKey = key(exitD);

  // if (!data1.length) {
  //   return { startAngle: 0, endAngle: 0 };
  // }

  // for (let i = 0; i < data1.length; ++i) {
  //   if (key(data1[i]) > exitDKey) {
  //     // REPLACE!!!
  //     if (i === 0) {
  //       return { startAngle: 0, endAngle: 0 };
  //     } else {
  //       const d = data1[i - 1];
  //       return { startAngle: d.endAngle, endAngle: d.endAngle };
  //     }
  //   }
  // }

  // return { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
}

function findEnteringArc(i: number, data0, data1, order) {
  return findArc(i, data1, data0, order);
  // const enterD = data1[i];
  // const enterDKey = key(enterD);

  // if (!data0.length) {
  //   return { startAngle: 0, endAngle: 0 };
  // }

  // for (let i = 0; i < data0.length; ++i) {
  //   if (key(data0[i]) > enterDKey) {
  //     // REPLACE!!!
  //     if (i === 0) {
  //       return { startAngle: 0, endAngle: 0 };
  //     } else {
  //       const d = data0[i - 1];
  //       return { startAngle: d.endAngle, endAngle: d.endAngle };
  //     }
  //   }
  // }

  // return { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
}

function createGroup(parent: any, className: string) {
  const group = parent.selectAll(`g.${className}`).data([null]);
  return group
    .enter()
    .append("g")
    .classed(className, true)
    .merge(group);
}

function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function wrap(text, getTextData, width) {
  text.each(function(d) {
    // console.log('text.text()', text.text());
    var text = d3.select(this),
      words = getTextData(d)
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.05, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      const node = tspan.node();
      if (node && node.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          // .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .attr("dy", lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

function arrangeLabelsTry(selection, labelClass) {
  // selection.selectAll(label_class)
}

function arrangeLabels(selection, label_class) {
  var move = 1;
  while (move > 0) {
    move = 0;
    selection.selectAll(label_class).each(function() {
      var that = this;
      var a = this.getBoundingClientRect();
      selection.selectAll(label_class).each(function() {
        if (this != that) {
          var b = this.getBoundingClientRect();
          if (
            Math.abs(a.left - b.left) * 2 < a.width + b.width &&
            Math.abs(a.top - b.top) * 2 < a.height + b.height
          ) {
            var dx =
              (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) *
              0.01;
            var dy =
              (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) *
              0.02;
            var tt = getTransformation(d3.select(this).attr("transform"));
            var to = getTransformation(d3.select(that).attr("transform"));
            move += Math.abs(dx) + Math.abs(dy);

            to.translate = [to.translateX + dx, to.translateY + dy];
            tt.translate = [tt.translateX - dx, tt.translateY - dy];
            d3.select(this).attr(
              "transform",
              "translate(" + tt.translate + ")"
            );
            d3.select(that).attr(
              "transform",
              "translate(" + to.translate + ")"
            );
            a = this.getBoundingClientRect();
          }
        }
      });
    });
  }
}

function getTransformation(transform) {
  /*
   * This code comes from a StackOverflow answer to a question looking
   * to replace the d3.transform() functionality from v3.
   * http://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4
   */
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  g.setAttributeNS(null, "transform", transform);
  var matrix = g.transform.baseVal.consolidate().matrix;

  var { a, b, c, d, e, f } = matrix;
  var scaleX, scaleY, skewX;
  if ((scaleX = Math.sqrt(a * a + b * b))) (a /= scaleX), (b /= scaleX);
  if ((skewX = a * c + b * d)) (c -= a * skewX), (d -= b * skewX);
  if ((scaleY = Math.sqrt(c * c + d * d)))
    (c /= scaleY), (d /= scaleY), (skewX /= scaleY);
  if (a * d < b * c) (a = -a), (b = -b), (skewX = -skewX), (scaleX = -scaleX);
  return {
    translateX: e,
    translateY: f,
    rotate: (Math.atan2(b, a) * Math.PI) / 180,
    skewX: (Math.atan(skewX) * Math.PI) / 180,
    scaleX: scaleX,
    scaleY: scaleY
  };
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

    const svg = d3.select(this._container.current);
    svg.attr("width", width);
    svg.attr("height", height);

    const offsetGroup = createGroup(svg, "offsetParent");
    offsetGroup.attr("transform", `translate(${width * 0.5},${height * 0.5})`);

    const slicesGroup = createGroup(offsetGroup, "slices");
    const labelsGroup = createGroup(offsetGroup, "labels");
    const linesGroup = createGroup(offsetGroup, "lines");

    const radius =
      Math.min(
        width -
          (MIN_LABEL_WIDTH_PX +
            TEXT_TO_LINE_PADDING_PX +
            EXTRA_LINE_LENGTH_PX) *
            2,
        height
      ) *
        0.5 -
      MARGIN_PX * 2;
    let labelWidth =
      width * 0.5 -
      radius * LABEL_RADIUS_PERCENT -
      TEXT_TO_LINE_PADDING_PX -
      EXTRA_LINE_LENGTH_PX;
    labelWidth = Math.max(MIN_LABEL_WIDTH_PX, labelWidth);

    const sliceArc = d3
      .arc()
      .innerRadius(radius * INNER_SLICE_RADIUS_PERCENT)
      .outerRadius(radius * OUTER_SLICE_RADIUS_PERCENT)
      .cornerRadius(2);

    const labelArc = d3
      .arc()
      .outerRadius(radius * LABEL_RADIUS_PERCENT)
      .innerRadius(radius * LABEL_RADIUS_PERCENT);

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
      return (t: number) => sliceArc(iFunc(t));
    }

    let path = slicesGroup.selectAll<SVGPathElement, any>("path.slice");

    const data0 = path.data();
    const data1 = pie(data);
    const key = d => d.data.key;
    const order = d => d.data.order;
    const labelText = d => `${d.data.labelMessage}: ${d.data.value}`;

    path = path.data(data1, key);

    path
      .exit()
      .datum(function(d, i, nodes) {
        const findNeighbour = findExitingArc(i, data0, data1, order);
        return { ...d, ...(findNeighbour || d) };
      })
      .transition()
      .duration(DURATION_MS)
      .attrTween("d", arcTween)
      .remove();

    path = path
      .enter()
      .append("path")
      .classed("slice", true)
      // .classed("selected", d => includes(selectedIds, key(d)))
      .each(function(d, i, nodes) {
        this._current = findEnteringArc(i, data0, data1, order) || d;
      })
      .attr("fill", d => color(d.data, false))
      // .transition()
      // .duration(DURATION_MS)
      // .attrTween("d", arcTween)
      .merge(path);
    path
      .classed("selected", d => includes(selectedIds, key(d)))
      .transition()
      .duration(DURATION_MS)
      .attrTween("d", arcTween);

    // LABELS:

    let label = labelsGroup.selectAll("text").data(data1, key);

    label.exit().remove();
    label = label
      .enter()
      .append("text")
      .attr("dy", ".35em")
      // .attr("dy", 0)
      // .text(labelText)
      .merge(label);
    label
      .text(labelText)
      .each(d => (d.direction = midAngle(d) < Math.PI ? 1 : -1))
      // .attr("custom-direction", d => (midAngle(d) < Math.PI ? 1 : -1))
      .call(wrap, labelText, labelWidth)
      .attr("transform", function(d, i, nodes) {
        const direction = d.direction;
        const pos = labelArc.centroid(d);
        // const direction = midAngle(d) < Math.PI ? 1 : -1;
        pos[0] =
          (TEXT_TO_LINE_PADDING_PX + EXTRA_LINE_LENGTH_PX + radius) * direction;
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function(d) {
        return d.direction > 0 ? "start" : "end";
      })
      .each((d, i, nodes) => {
        const node = nodes[i];
        console.log("bounding", key(d), node.getBoundingClientRect());
        // x, y, width, height
      });
    // .transition()
    // .duration(DURATION_MS)
    // .attrTween("transform", function(d) {
    //   this._current = this._current || d;
    //   const interpolate = d3.interpolate(this._current, d);
    //   this._current = interpolate(0);
    //   return function(t) {
    //     const d2 = interpolate(t);
    //     const pos = labelArc.centroid(d2);
    //     const direction = midAngle(d2) < Math.PI ? 1 : -1;
    //     pos[0] =
    //       (TEXT_TO_LINE_PADDING_PX + EXTRA_LINE_LENGTH_PX + radius) *
    //       direction;
    //     return "translate(" + pos + ")";
    //   };
    // })
    // .styleTween("text-anchor", function(d) {
    //   this._current = this._current || d;
    //   const interpolate = d3.interpolate(this._current, d);
    //   this._current = interpolate(0);
    //   return function(t) {
    //     const d2 = interpolate(t);
    //     return midAngle(d2) < Math.PI ? "start" : "end";
    //   };
    // });

    // arrangeLabelsTry(svg, "text");

    // SLICE-TO-LABEL LINES:

    let polyline = linesGroup.selectAll("polyline").data(data1, key);
    polyline.exit().remove();
    polyline = polyline
      .enter()
      .append("polyline")
      .merge(polyline);

    polyline
      .transition()
      .duration(DURATION_MS)
      .attrTween("points", function(d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          const d2 = interpolate(t);
          const pos = labelArc.centroid(d2);
          const direction = midAngle(d2) < Math.PI ? 1 : -1;
          pos[0] =
            (EXTRA_LINE_LENGTH_PX + radius * LABEL_RADIUS_PERCENT) * direction;
          // pos[1] = pos[1] + 10;
          return [sliceArc.centroid(d2), labelArc.centroid(d2), pos];
        };
      });
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
