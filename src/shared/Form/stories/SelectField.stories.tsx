import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import SelectField from "../SelectField";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  value: "1"
});

const options = [
  { id: "1", label: "Some text 1" },
  { id: "2", label: "Some text 2" },
  { id: "3", label: "Some text 3" }
];

storiesOf("Form/SelectField", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <SelectField<string>
          label="The label"
          value={state.value}
          options={options}
          onChange={(value: any) => store.set({ value })}
          name="foo"
          disabled={boolean("Disabled", false)}
        />
      )}
    </State>
  ));
