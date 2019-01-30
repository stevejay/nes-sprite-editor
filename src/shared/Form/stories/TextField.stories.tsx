import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import TextField from "../TextField";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  value: "Some text"
});

storiesOf("Form/TextInput", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <TextField
          label="The label"
          input={
            {
              value: state.value,
              onChange: (value: any) => store.set({ value })
            } as any
          }
          meta={{}}
          name="foo"
          disabled={boolean("Disabled", false)}
        />
      )}
    </State>
  ));
