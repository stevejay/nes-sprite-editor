import TileCanvas from "..";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  row: 0,
  column: 0,
  pressed: false
});

storiesOf("TileCanvas/InteractionTracker", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <>
          <p>
            row={state.row}, column={state.column}, pressed={`${state.pressed}`}
          </p>
          <div>
            <TileCanvas.InteractionTracker
              rows={2}
              columns={3}
              row={state.row}
              column={state.column}
              onSelect={(row, column, pressed) =>
                store.set({ row, column, pressed })
              }
            >
              <div
                tabIndex={0}
                style={{
                  width: 8 * 8 * 3 * 2,
                  height: 8 * 8 * 2 * 2,
                  backgroundColor: "papayawhip"
                }}
              />
            </TileCanvas.InteractionTracker>
          </div>
        </>
      )}
    </State>
  ));
