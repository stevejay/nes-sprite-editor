import d3Cloud from "d3-cloud";

export type WordCloudNode = {
  id: string;
  text: string;
  value: number;
};

export type D3WordCloudNode = WordCloudNode & d3Cloud.Word;
