import TileCanvas from "..";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("TileCanvas/Highlight", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ position: "relative", width: 200, height: 150 }}>
      <TileCanvas.Highlight
        row={2}
        column={3}
        tileWidth={50}
        tileHeight={30}
        aria-label="The aria label"
        focusOnly={boolean("Focus only", false)}
      >
        foo
      </TileCanvas.Highlight>
    </div>
  ));
