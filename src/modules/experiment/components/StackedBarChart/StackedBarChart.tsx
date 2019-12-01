import React, { FC, useRef, useEffect, useMemo } from "react";
// import * as d3 from "d3";
import { stackedBarChart } from "./d3-stacked-bar-chart";

// const useSVGGroup = (ref: RefObject<SVGSVGElement>) => {
//   useEffect()
// }

type Props = {
  width: number;
  height: number;
  data: Array<{
    date: Date;
    disease: number;
    wounds: number;
    other: number;
  }>;
};

const StackedBarChart: FC<Props> = ({ width, height, data }) => {
  const marginLeft = 20;
  const marginTop = 0;
  const ref = useRef<SVGSVGElement>(null);
  const barChart = useRef(stackedBarChart());

  useEffect(() => {
    barChart.current.width(width);
    barChart.current.height(height);
    barChart.current.marginLeft(marginLeft);
    barChart.current.marginTop(marginTop);
    barChart.current(ref.current, data);
  }, [width, height, marginLeft, marginTop, data]);

  return (
    <svg ref={ref} style={{ width, height, backgroundColor: "papayawhip" }} />
  );
};

export { StackedBarChart };
