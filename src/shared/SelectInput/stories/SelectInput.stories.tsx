import * as React from "react";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import SelectInput from "../SelectInput";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent",
  width: 300
});

const store = new Store({
  selectedId: 1
});

const options = [
  { id: 1, label: "Some text 1" },
  { id: 2, label: "Some text 2" },
  { id: 3, label: "Some text 3" }
];

storiesOf("SelectInput", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <SelectInput<number>
          id="select-basic"
          options={options}
          selectedId={state.selectedId}
          disabled={boolean("Disabled", false)}
          onChange={(id: number) => store.set({ selectedId: id })}
        />
      )}
    </State>
  ))
  .add("No options", () => (
    <State store={store}>
      {state => (
        <SelectInput<number>
          id="select-basic"
          options={[]}
          selectedId={null}
          onChange={(id: number) => {
            console.log(id);
            store.set({ selectedId: id });
          }}
        />
      )}
    </State>
  ));
