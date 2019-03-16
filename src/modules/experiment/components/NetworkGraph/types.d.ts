import * as d3 from "d3";

export type GetOrSet<ValueT, ThisT> = {
  (): ValueT;
  (value: ValueT): ThisT;
};

export type ValueFunction<ValueT, NodeT extends d3.SimulationNodeDatum> = (
  node: NodeT,
  index: number,
  nodes: Array<NodeT>
) => ValueT;

export type NodeEntity = {
  id: string;
  depth: number;
  normalisedWeight: number;
};

export type LinkEntity = {
  id: string;
  source: string;
  target: string;
  normalisedWeight: number;
};

export type D3NodeEntity = NodeEntity & d3.SimulationNodeDatum;

export type D3LinkEntity = LinkEntity & d3.SimulationLinkDatum<D3NodeEntity>;

export type SimulationWorkerEvent = {
  data: {
    nodes: Array<D3NodeEntity>;
    links: Array<D3LinkEntity>;
    width: number;
    height: number;
    maxRadius: number;
    version: number;
  };
};

export type SimulationWorkerResult = {
  type: "end";
  nodes: Array<D3NodeEntity>;
  links: Array<D3LinkEntity>;
  version: number;
};
