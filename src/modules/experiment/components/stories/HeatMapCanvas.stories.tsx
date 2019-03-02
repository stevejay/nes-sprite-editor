import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import HeatMapCanvas from "../HeatMapCanvas";
import "../../../../index.scss";
import { range, random, clamp, sampleSize } from "lodash";
// import { interpolateRgb } from "d3-interpolate";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936"
});

let count = 0;

function generateData() {
  const result = range(0, 24 * 7).map(i => {
    // const value = count % 2;
    // return value;
    return random(0, 1, true);
  });
  // count += 1;
  return result;
}

const store = new Store({
  data: generateData()
});

// const COLOR_CALLBACK = interpolateRgb("#213446", "#0096cb");
const COLOR_CALLBACK = (datum: number) =>
  `rgba(0,150,203,${clamp(0.2 + datum * 1.0, 0, 1)})`;

storiesOf("HeatMap", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("HeatMapCanvas", () => (
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
            <HeatMapCanvas
              width={500}
              data={state.data}
              selectedIndexes={sampleSize(range(0, 24 * 7), 3)}
              columnCount={24}
              colorInterpolator={COLOR_CALLBACK}
            />
          )}
        </State>
      </div>
    </div>
  ));
