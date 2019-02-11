import * as React from "react";
import { host } from "storybook-host";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import { SYSTEM_PALETTE_OPTIONS } from "../../../../model";
import ColorPicker from "../ColorPicker";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  colorId: 0
});

storiesOf("PaletteColorInput/ColorPicker", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <ColorPicker
          palette={SYSTEM_PALETTE_OPTIONS[0]}
          selectedColorId={state.colorId}
          scale={24}
          onChange={color => store.set({ colorId: color.id })}
        />
      )}
    </State>
  ));
