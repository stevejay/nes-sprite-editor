import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { includes, random, sortBy, sampleSize } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import DonutChart from "..";
import { DonutChartDatum } from "../types";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

function generateData(): Array<DonutChartDatum> {
  const inputs = [
    { key: "internal-external", labelMessage: "Internal & External" },
    {
      key: "internal-multiple-external-multiple",
      labelMessage: "Internal (multiple people) & External (multiple people)"
    },
    {
      key: "internal-single-external-multiple",
      labelMessage: "Internal (single person) & External (multiple people)"
    },
    {
      key: "internal-multiple-external-single",
      labelMessage: "Internal (multiple people) & External (single person)"
    },
    {
      key: "internal-single-external-single",
      labelMessage: "Internal (single person) & External (single person)"
    },
    { key: "internal-multiple", labelMessage: "Internal (multiple people)" },
    { key: "internal-single", labelMessage: "Internal (single person)" },
    { key: "external-multiple", labelMessage: "External (multiple people)" },
    { key: "external-single", labelMessage: "External (single person)" }
  ];

  let nodes = inputs.map(input => ({
    ...input,
    value: random(1, 300)
  }));

  nodes = sampleSize(nodes, random(nodes.length - 2, nodes.length));
  // return sortBy(nodes, value => value.value);
  return sortBy(nodes, value => value.key);
}

function coloring(node: DonutChartDatum, selected: boolean): string {
  console.log("node key", node);
  switch (node.key) {
    case "internal-external":
      return "cornflowerblue";
    case "internal-multiple-external-multiple":
      return "mediumpurple";
    case "internal-single-external-multiple":
      return "orange";
    case "internal-multiple-external-single":
      return "lightseagreen";
    case "internal-single-external-single":
      return "lightcoral";
    case "internal-multiple":
      return "indianred";
    case "internal-single":
      return "goldenrod";
    case "external-multiple":
      return "darkseagreen";
    case "external-single":
      return "darkgoldenrod";
    default:
      return "black";
  }
}

const store = new Store<{
  data: Array<DonutChartDatum>;
  selectedIds: Array<string>;
}>({
  data: [],
  selectedIds: []
});

storiesOf("SE/DonutChart", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => store.set({ data: generateData() })}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <DonutChart
              data={state.data}
              selectedIds={state.selectedIds}
              coloring={coloring}
              onToggleSlice={datum => {
                let newSelectedIds = state.selectedIds.slice();
                if (includes(newSelectedIds, datum.key)) {
                  newSelectedIds = newSelectedIds.filter(x => x !== datum.key);
                } else {
                  newSelectedIds.push(datum.key);
                }
                store.set({ selectedIds: newSelectedIds });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
