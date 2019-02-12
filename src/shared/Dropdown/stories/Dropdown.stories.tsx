import { State, Store } from "@sambego/storybook-state";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import Dropdown from "../Dropdown";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent",
  width: 300
});

const store = new Store({
  value: 1
});

const options = [
  { id: 1, label: "Some text 1 asdfasd asfasdfa asdf asdfasf asdf adfasf" },
  { id: 2, label: "Some text 2" },
  { id: 3, label: "Some text 3" }
];

storiesOf("Dropdown", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <Dropdown<number>
          id="select-basic"
          label="Some label:"
          options={options}
          value={state.value}
          disabled={boolean("Disabled", false)}
          onChange={(value: number) => store.set({ value })}
        />
      )}
    </State>
  ));
