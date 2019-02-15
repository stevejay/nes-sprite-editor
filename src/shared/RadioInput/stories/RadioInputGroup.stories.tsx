import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import RadioInput from "..";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  selectedId: 1
});

const options = [
  { id: 1, label: "First option" },
  { id: 2, label: "Second option" }
];

storiesOf("RadioInput", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Radio input group", () => (
    <State store={store}>
      {state => (
        <RadioInput.Group
          legend="The Radio Group Legend:"
          options={options}
          selectedId={state.selectedId}
          disabled={boolean("Disabled", false)}
          inline={boolean("Inline", false)}
          onChange={id => store.set({ selectedId: id })}
        />
      )}
    </State>
  ));
