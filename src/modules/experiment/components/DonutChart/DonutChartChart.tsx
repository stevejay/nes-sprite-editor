import React from "react";
import * as d3 from "d3";
import { includes, findIndex, findLastIndex } from "lodash";
// import { default as d3HeatMap, ID3HeatMap } from "./d3-heat-map";
import { DonutChartDatum } from "./types";
import { TooltipData } from "../Tooltip/types";
import { PieArcDatum } from "d3";

// https://swizec.com/blog/silky-smooth-piechart-transitions-react-d3js/swizec/8258
// https://bl.ocks.org/mbostock/5682158

const DURATION_MS = 1500;

// console.log("datum to exit", key(d), key(data0[i]));
// const findNeighbour = findNeighborArc(i, data1, data0, key, true);

function findExitingArc(i, data0, data1, key) {
  const exitD = data0[i];
  const exitDKey = key(exitD);

  if (!data1.length) {
    return { startAngle: 0, endAngle: 0 };
  }

  for (let i = 0; i < data1.length; ++i) {
    if (key(data1[i]) > exitDKey) {
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

function findEnteringArc(i, data0, data1, key) {
  const enterD = data1[i];
  const enterDKey = key(enterD);

  if (!data0.length) {
    return { startAngle: 0, endAngle: 0 };
  }

  for (let i = 0; i < data0.length; ++i) {
    if (key(data0[i]) > enterDKey) {
      // REPLACE!!!
      if (i === 0) {
        return { startAngle: 0, endAngle: 0 };
      } else {
        const d = data0[i - 1];
        return { startAngle: d.endAngle, endAngle: d.endAngle };
      }
    }
  }

  return { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
}

function findNeighborArc(i, data0, data1, key, exiting) {
  console.log("FIND", i, data0, data1, key, exiting);
  if (exiting) {
    let result = null;
    const d = findPreceding(i, data0, data1, key);
    // console.log("d for exiting", d);
    // console.log(
    //   "data0 keys",
    //   data0.map(x => key(x)),
    //   "data1 keys",
    //   data1.map(x => key(x))
    // );

    if (!d && data0 && data0.length) {
      const firstOldKey = key(data0[0]);
      let firstMatchingNewIndex = findIndex(data1, x => key(x) === firstOldKey);
      if (firstMatchingNewIndex === -1) {
        firstMatchingNewIndex = data1.length;
      }

      if (i < firstMatchingNewIndex) {
        result = { startAngle: 0, endAngle: 0 };
      }
    }

    if (!result) {
      result = d ? { startAngle: d.endAngle, endAngle: d.endAngle } : null;
    }

    // console.log("d for exiting result", result);
    return result;
  } else {
    let result = null;
    const d = findFollowing(i, data0, data1, key);
    // console.log("d for entering", d);

    if (!d && data0 && data0.length > 0) {
      // const lastOldKey = key(data0[data0.length - 1]);
      // let lastMatchingNewIndex = findLastIndex(
      //   data1,
      //   x => key(x) === lastOldKey
      // );
      // if (lastMatchingNewIndex === -1) {
      //   lastMatchingNewIndex = 0;
      // }

      // if (i > lastMatchingNewIndex) {
      //   result = { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
      // }

      if (i === data1.length - 1) {
        result = { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
      }
    }

    if (!result) {
      result = d ? { startAngle: d.startAngle, endAngle: d.startAngle } : null;
    }

    // console.log("d for entering result", result);
    return result;
  }
  // var d;

  // const result = (d = findPreceding(i, data0, data1, key))
  //   ? { startAngle: d.endAngle, endAngle: d.endAngle }
  //   : (d = findFollowing(i, data0, data1, key))
  //   ? { startAngle: d.startAngle, endAngle: d.startAngle }
  //   : null;

  // console.log("for node", data1[i].data, result);

  // if (key(data1[i]) === "internal-single-external-multiple" && result) {
  //   console.log(
  //     "changed here",
  //     data1[i],
  //     findPreceding(i, data0, data1, key), // <<<
  //     findFollowing(i, data0, data1, key) // <<< undefined
  //   );
  //   return { startAngle: Math.PI * 2, endAngle: Math.PI * 2 };
  // }

  // return result;
}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  const m = data0.length;

  // const node = data1[i];

  while (--i >= 0) {
    const k = key(data1[i]);
    for (let j = 0; j < m; ++j) {
      if (key(data0[j]) === k) {
        return data0[j];
      }
    }
  }
  // if (data0.length && key(node) !== key(data0[0])) {
  //   console.log("returning new preceeding");
  //   return data0[0];
  // }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  const n = data1.length;
  const m = data0.length;

  // const node = data1[i];

  while (++i < n) {
    var k = key(data1[i]);
    for (let j = 0; j < m; ++j) {
      if (key(data0[j]) === k) {
        return data0[j];
      }
    }
  }
  // if (data0.length && key(node) !== key(data0[data0.length - 1])) {
  //   console.log("returning new following");
  //   return data0[data0.length - 1];
  // }
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
    const key = d => d.data.key; // (d && d.data ? d.data.key : null);

    path = path.data(data1, key);

    path
      .exit()
      .datum(function(d, i, nodes) {
        // console.log("datum to exit", key(d), key(data0[i]));
        const findNeighbour = findExitingArc(i, data0, data1, key);
        // const findNeighbour = findNeighborArc(i, data1, data0, key, true);
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
      // .classed("selected", d => includes(selectedIds, d.data.key))
      .each(function(d, i, nodes) {
        // console.log("datum to enter", key(d), key(data1[i]));
        this._current = findEnteringArc(i, data0, data1, key) || d;
        // this._current = findNeighborArc(i, data0, data1, key, false) || d;
      })
      .attr("fill", d => color(d.data, false))
      // .transition()
      // .duration(DURATION_MS)
      // .attrTween("d", arcTween)
      // @ts-ignore
      .merge(path);
    path
      .classed("selected", d => includes(selectedIds, d.data.key))
      .transition()
      .duration(DURATION_MS)
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
