import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import HeatMap from "../HeatMap";
import "../../../../index.scss";
import { range, random, clamp, sampleSize, includes } from "lodash";
// import { interpolateRgb } from "d3-interpolate";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

// let count = 0;

function generateData() {
  const result = range(0, 24 * 7).map(i => {
    // const value = count % 2;
    // return value;
    return random(0, 1, true);
  });
  // count += 1;
  return result;
}

const store = new Store<{
  data: Array<number>;
  selectedIndexes: Array<number>;
}>({
  data: generateData(),
  selectedIndexes: [] // sampleSize(range(0, 24 * 7), 3)
});

// const COLOR_CALLBACK = interpolateRgb("#213446", "#0096cb");
// const COLOR_CALLBACK = (datum: number) =>
//   `rgba(0,150,203,${clamp(0.2 + datum * 1.0, 0, 1)})`;

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

storiesOf("HeatMap", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("HeatMap", () => (
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
