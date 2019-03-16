import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import { WordCloudNode, D3WordCloudNode } from "./types";
import { minBy, maxBy, cloneDeep } from "lodash";

type Result = {
  d3Nodes: Array<D3WordCloudNode>;
  bounds: Array<{ x: number; y: number }>;
};

export default async function calculateWordCloudData(
  nodes: Array<WordCloudNode>,
  width: number,
  height: number,
  minFontSize: number,
  maxFontSize: number
) {
  if (nodes.length === 0) {
    return { d3Nodes: [], bounds: [] };
  }

  // sortBy is a stable sort, so ordering is preserved:
  // nodes = sortBy(nodes, node => (includes(selectedNodeIds, node.id) ? 0 : 1));
  // nodes.forEach(node => {
  //   if (includes(selectedNodeIds, node.id)) {
  //     node.value = 500;
  //   }
  // });
  // console.log("nodes", nodes);

  // console.log("calculating...", nodes.length, width, height);

  return await new Promise<Result>(resolve => {
    const minNode = minBy(nodes, node => node.value);
    const maxNode = maxBy(nodes, node => node.value);
    const fontSize = d3
      .scaleLog()
      .range([minFontSize, maxFontSize])
      .domain([minNode ? minNode.value : 0, maxNode ? maxNode.value : 0]);
    d3Cloud<D3WordCloudNode>()
      .words(cloneDeep(nodes))
      .size([width, height])
      .padding(2)
      .rotate(0)
      .spiral("rectangular")
      .font("sans-serif")
      .fontSize(d => fontSize(d.value))
      .on("end", (d3Nodes, bounds) => resolve({ d3Nodes, bounds }))
      .timeInterval(10)
      .start();
  });
}
