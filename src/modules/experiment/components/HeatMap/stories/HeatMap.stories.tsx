import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { includes, random, range } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import HeatMap from "../HeatMap";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

function generateData() {
  return range(0, 24 * 7).map(i => random(0, 1, true));
}

const store = new Store<{
  data: Array<number>;
  selectedIndexes: Array<number>;
}>({
  data: generateData(),
  selectedIndexes: []
});

const X_LABELS = [
  "1",
  "",
  "",
  "",
  "",
  "6",
  "",
  "",
  "",
  "",
  "",
  "12",
  "",
  "",
  "",
  "",
  "",
  "18",
  "",
  "",
  "",
  "",
  "",
  "24"
];

const Y_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

storiesOf("SteelEye/HeatMap", module)
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
            <HeatMap
              data={state.data}
              xLabels={X_LABELS}
              yLabels={Y_LABELS}
              selectedIndexes={state.selectedIndexes}
              onTileClick={value => {
                let newSelectedIndexes = state.selectedIndexes.slice();
                if (includes(newSelectedIndexes, value)) {
                  newSelectedIndexes = newSelectedIndexes.filter(
                    x => x !== value
                  );
                } else {
                  newSelectedIndexes.push(value);
                }
                store.set({
                  selectedIndexes: newSelectedIndexes
                });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
