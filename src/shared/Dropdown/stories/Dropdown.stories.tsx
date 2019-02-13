import { State, Store } from "@sambego/storybook-state";
import { boolean, withKnobs, select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import Dropdown from "../Dropdown";
import { PopperProps } from "react-popper";
import { range } from "lodash";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent",
  width: 300
});

const store = new Store({
  value: 0
});

const placementOptions = ["top", "bottom"];

const options = range(0, 20).map(id => ({
  id,
  label: `Some text label #${id}`
}));

options[0].label =
  "Some text label #0 that is long and so will have an ellipsis or wrap";

storiesOf("Dropdown", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <Dropdown<number>
          label="Some label:"
          options={options}
          value={state.value}
          disabled={boolean("Disabled", false)}
          showScrollbar={boolean("Show scrollbar", true)}
          placement={
            select(
              "Placement",
              placementOptions,
              "bottom"
            ) as PopperProps["placement"]
          }
          onChange={(value: number) => store.set({ value })}
        />
      )}
    </State>
  ));
