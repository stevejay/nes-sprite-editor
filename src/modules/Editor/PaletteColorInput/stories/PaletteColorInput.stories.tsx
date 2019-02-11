import * as React from "react";
import { host } from "storybook-host";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import PaletteColorInput from "..";
import { SYSTEM_PALETTE_OPTIONS } from "../../constants";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  color: SYSTEM_PALETTE_OPTIONS[0].values[13]
});

storiesOf("PaletteColorInput/PaletteColorInput", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <PaletteColorInput
          color={state.color}
          systemPalette={SYSTEM_PALETTE_OPTIONS[0]}
          onChange={color => store.set({ color })}
        />
      )}
    </State>
  ));
