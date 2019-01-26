import * as React from "react";
import { host } from "storybook-host";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import GridInteractionTracker from "../GridInteractionTracker";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  type: "absolute",
  value: { row: 0, column: 0 }
});

storiesOf("TileCanvas/GridInteractionTracker", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <>
          <p>
            {state.type}: row={state.value.row}, column={state.value.column}
          </p>
          <div>
            <GridInteractionTracker
              rows={2}
              columns={3}
              onChange={(type, value) => store.set({ type, value })}
            >
              <div
                tabIndex={0}
                style={{
                  width: 8 * 8 * 3 * 2,
                  height: 8 * 8 * 2 * 2,
                  backgroundColor: "papayawhip"
                }}
              />
            </GridInteractionTracker>
          </div>
        </>
      )}
    </State>
  ));
