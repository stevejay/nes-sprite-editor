export type HeatMapNode = {
  id: number;
  day: number;
  hour: number;
  count: number;
  normalisedCount: number; //  in range [0, 1]
  details?: Array<{ id: string; count: number }>;
};
