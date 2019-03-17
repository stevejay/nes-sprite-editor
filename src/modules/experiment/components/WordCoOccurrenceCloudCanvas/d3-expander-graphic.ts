import * as d3 from "d3";
import { GetOrSet } from "../NetworkGraph/types";
import { range } from "lodash";

const EXPANDER_WIDTH = 34;
const EXPANDER_MARGIN_VERTICAL = 25;

type ExpanderLink = {
  key: number;
  source: { x: number; y: number };
  target: {
    x: number;
    y: number;
  };
};

export interface IExpanderGraphic {
  (show: boolean): void;

  containerElement(element: SVGSVGElement): this;

  width(): number;
  width(value: number): this;

  height(): number;
  height(value: number): this;
}

export default function d3ExpanderGraphic(): IExpanderGraphic {
  let containerElement: SVGSVGElement | null = null;
  let width = 0;
  let height = 0;
  const expandedLink = d3
    .linkHorizontal()
    .x(d => d.x)
    .y(d => d.y);

  async function renderer(show: boolean) {
    const svg = d3.select(containerElement);
    svg.attr("width", width);
    svg.attr("height", height);

    const data = generateExpanderData(show, width, height);

    const expander = svg
      .selectAll<SVGPathElement, ExpanderLink>("path")
      .data(data, d => d.key);

    expander
      .exit()
      .transition()
      .duration(500)
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x(d => d.x)
          .y(() => height * 0.5)
      )
      .style("opacity", 1e-6)
      .remove();

    expander
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x(d => d.x)
          .y(() => height * 0.5)
      )
      .style("opacity", 1e-6)
      .transition()
      .delay(400)
      .duration(500)
      .attr("d", expandedLink)
      .style("opacity", 1);

    expander.attr("d", expandedLink);
  }

  renderer.containerElement = function(element: SVGSVGElement) {
    containerElement = element;
    return renderer;
  };

  renderer.width = ((value?: number): number | IExpanderGraphic => {
    if (typeof value !== "undefined") {
      width = value || 0;
      return renderer;
    }
    return width;
  }) as GetOrSet<number, IExpanderGraphic>;

  renderer.height = ((value?: number): number | IExpanderGraphic => {
    if (typeof value !== "undefined") {
      height = value || 0;
      return renderer;
    }
    return height;
  }) as GetOrSet<number, IExpanderGraphic>;

  return renderer;
}

function generateExpanderData(
  visible: boolean,
  width: number,
  height: number
): Array<ExpanderLink> {
  if (!visible) {
    return [];
  }
  return range(0, 5).map(index => {
    return {
      key: index,
      source: { x: width * 0.5 - EXPANDER_WIDTH * 0.5, y: height * 0.5 },
      target: {
        x: width * 0.5 + EXPANDER_WIDTH * 0.5,
        y:
          EXPANDER_MARGIN_VERTICAL +
          ((height - EXPANDER_MARGIN_VERTICAL * 2) / 4) * index
      }
    };
  });
}
