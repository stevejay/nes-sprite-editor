export type CommsSourceNode = {
  id: string;
  text: string;
  value: number;
};

export type CommsSource = {
  id: string;
  name: string;
  nodes: Array<CommsSourceNode>;
};
