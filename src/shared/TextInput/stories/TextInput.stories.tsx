import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import TextInput from "../TextInput";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  value: "Some text"
});

storiesOf("TextInput", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <TextInput
          value={state.value}
          disabled={boolean("Disabled", false)}
          onChange={value => store.set({ value })}
        />
      )}
    </State>
  ));
