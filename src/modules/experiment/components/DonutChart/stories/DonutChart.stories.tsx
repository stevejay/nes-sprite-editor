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

  // let nodes = inputs.map(input => ({
  //   ...input,
  //   value: random(1, 5) === 1 ? 0 : random(1, 300)
  // }));

  nodes = sampleSize(nodes, random(nodes.length - 2, nodes.length));
  // return sortBy(nodes, value => value.value);
  return sortBy(nodes, value => value.key);
}

function coloring(node: DonutChartDatum, selected: boolean): string {
  switch (node.key) {
    case "external-multiple":
      return "#222";
    case "external-single":
      return "#333";
    case "internal-external":
      return "#555";
    case "internal-multiple":
      return "#777";
    case "internal-multiple-external-multiple":
      return "#999";
    case "internal-multiple-external-single":
      return "#aaa";
    case "internal-single":
      return "#ccc";
    case "internal-single-external-multiple":
      return "#eee";
    case "internal-single-external-single":
      return "#fff";
    default:
      return "black";
  }
}

function dataOne() {
  return [
    {
      key: "internal-external",
      labelMessage: "Internal & External",
      value: 244
    },
    {
      key: "internal-multiple-external-multiple",
      labelMessage: "Internal (multiple people) & External (multiple people)",
      value: 92
    }
  ];
}

function dataTwo() {
  return [
    {
      key: "internal-external",
      labelMessage: "Internal & External",
      value: 146
    },
    {
      key: "internal-single-external-multiple",
      labelMessage: "Internal (single person) & External (multiple people)",
      value: 164
    }
  ];
}

function dataThree() {
  return [
    {
      key: "internal-external",
      labelMessage: "Internal & External",
      value: 146
    },
    {
      key: "internal-multiple-external-multiple",
      labelMessage: "Internal (multiple people) & External (multiple people)",
      value: 92
    },
    {
      key: "internal-single-external-multiple",
      labelMessage: "Internal (single person) & External (multiple people)",
      value: 164
    }
  ];
}

function dataFour() {
  return [
    {
      key: "internal-external",
      labelMessage: "Internal & External",
      value: 171
    },
    {
      key: "internal-multiple-external-multiple",
      labelMessage: "Internal (multiple people) & External (multiple people)",
      value: 197
    }
  ];
}

function dataFive() {
  return [
    {
      key: "internal-single-external-multiple",
      labelMessage: "Internal (single person) & External (multiple people)",
      value: 280
    }
  ];
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
      <div style={{ display: "flex" }}>
        <button
          onClick={() => store.set({ data: generateData() })}
          style={{ marginBottom: 30, maxWidth: 100 }}
        >
          New Data
        </button>
        <button
          onClick={() => store.set({ data: dataOne() })}
          style={{ marginBottom: 30, maxWidth: 100 }}
        >
          Data One
        </button>
        <button
          onClick={() => store.set({ data: dataTwo() })}
          style={{ marginBottom: 30, maxWidth: 100 }}
        >
          Data Two
        </button>
        <button
          onClick={() => store.set({ data: dataThree() })}
          style={{ marginBottom: 30, maxWidth: 100 }}
        >
          Data Three
        </button>
        <button
          onClick={() => store.set({ data: dataFour() })}
          style={{ marginBottom: 30, maxWidth: 100 }}
        >
          Data Four
        </button>
        <button
          onClick={() => store.set({ data: dataFive() })}
          style={{ marginBottom: 30, maxWidth: 100 }}
        >
          Data Five
        </button>
      </div>
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
