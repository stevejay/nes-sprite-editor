import * as d3 from "d3";
import { HeatMapNode } from "./types";

const NO_VALUE_OPACITY = 0.075;
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;

const opacity = d3
  .scaleLinear()
  .range([MIN_OPACITY, MAX_OPACITY])
  .domain([0, 1]);

export default function heatMapColoring(d: HeatMapNode, selected: boolean) {
  return selected
    ? "rgba(0,203,142,1)"
    : `rgba(0,150,203,${
        d.count === 0 ? NO_VALUE_OPACITY : opacity(d.normalisedCount)
      })`;
}
