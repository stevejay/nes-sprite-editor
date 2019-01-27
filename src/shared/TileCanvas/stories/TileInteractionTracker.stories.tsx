import * as React from "react";
import { host } from "storybook-host";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import { TileInteractionTracker } from "..";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  row: 0,
  column: 0
});

storiesOf("TileCanvas/TileInteractionTracker", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <>
          <p>
            row={state.row}, column={state.column}
          </p>
          <div>
            <TileInteractionTracker
              rows={2}
              columns={3}
              row={state.row}
              column={state.column}
              onSelect={(row, column) => store.set({ row, column })}
            >
              <div
                tabIndex={0}
                style={{
                  width: 8 * 8 * 3 * 2,
                  height: 8 * 8 * 2 * 2,
                  backgroundColor: "papayawhip"
                }}
              />
            </TileInteractionTracker>
          </div>
        </>
      )}
    </State>
  ));
