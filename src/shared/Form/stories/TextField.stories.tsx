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

storiesOf("Form/TextField", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <TextField
          label="The label"
          value={state.value}
          onChange={(event: React.ChangeEvent<any>) =>
            store.set({ value: event.target.value })
          }
          name="foo"
          disabled={boolean("Disabled", false)}
        />
      )}
    </State>
  ));
