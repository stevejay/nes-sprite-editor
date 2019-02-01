import TileCanvas from "..";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("TileCanvas/Container", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ position: "relative", width: 200, height: 150 }}>
      <TileCanvas.Container>
        <div style={{ width: 100, height: 100 }} />
      </TileCanvas.Container>
    </div>
  ));
