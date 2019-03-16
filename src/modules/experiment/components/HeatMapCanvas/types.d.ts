export type DetailEntry = { channel: string; count: number };

export type HeatMapNode = {
  id: number;
  day: number;
  hour: number;
  count: number;
  normalisedCount: number; //  in range [0, 1]
  details?: Array<DetailEntry>;
};
