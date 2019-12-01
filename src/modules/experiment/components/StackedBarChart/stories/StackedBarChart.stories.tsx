import React from "react";
import * as d3 from "d3";
import { StackedBarChart } from "../StackedBarChart";

export default { title: "StackedBarChart" };

const parseDate = d3.timeParse("%m/%Y");

const crimeaData: Array<{
  date: Date;
  disease: number;
  wounds: number;
  other: number;
}> = [
  { date: parseDate("4/1854") as Date, disease: 1, wounds: 0, other: 5 },
  { date: parseDate("5/1854") as Date, disease: 12, wounds: 0, other: 9 },
  { date: parseDate("6/1854") as Date, disease: 11, wounds: 0, other: 6 },
  { date: parseDate("7/1854") as Date, disease: 359, wounds: 0, other: 23 },
  { date: parseDate("8/1854") as Date, disease: 828, wounds: 1, other: 30 },
  { date: parseDate("9/1854") as Date, disease: 788, wounds: 81, other: 70 },
  { date: parseDate("10/1854") as Date, disease: 503, wounds: 132, other: 128 },
  { date: parseDate("11/1854") as Date, disease: 844, wounds: 287, other: 106 },
  {
    date: parseDate("12/1854") as Date,
    disease: 1725,
    wounds: 114,
    other: 131
  },
  { date: parseDate("1/1855") as Date, disease: 2761, wounds: 83, other: 324 },
  { date: parseDate("2/1855") as Date, disease: 2120, wounds: 42, other: 361 },
  { date: parseDate("3/1855") as Date, disease: 1205, wounds: 32, other: 172 },
  { date: parseDate("4/1855") as Date, disease: 477, wounds: 48, other: 57 },
  { date: parseDate("5/1855") as Date, disease: 508, wounds: 49, other: 37 },
  { date: parseDate("6/1855") as Date, disease: 802, wounds: 209, other: 31 },
  { date: parseDate("7/1855") as Date, disease: 382, wounds: 134, other: 33 },
  { date: parseDate("8/1855") as Date, disease: 483, wounds: 164, other: 25 },
  { date: parseDate("9/1855") as Date, disease: 189, wounds: 276, other: 20 },
  { date: parseDate("10/1855") as Date, disease: 128, wounds: 53, other: 18 },
  { date: parseDate("11/1855") as Date, disease: 178, wounds: 33, other: 32 },
  { date: parseDate("12/1855") as Date, disease: 91, wounds: 18, other: 28 },
  { date: parseDate("1/1856") as Date, disease: 42, wounds: 2, other: 48 },
  { date: parseDate("2/1856") as Date, disease: 24, wounds: 0, other: 19 },
  { date: parseDate("3/1856") as Date, disease: 15, wounds: 0, other: 35 }
];

export const withDefault = () => (
  <StackedBarChart width={400} height={300} data={crimeaData} />
);
