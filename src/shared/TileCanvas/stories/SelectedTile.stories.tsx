import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import { SelectedTile } from "..";
import { withKnobs, boolean } from "@storybook/addon-knobs";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("TileCanvas/SelectedTile", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ position: "relative", width: 200, height: 150 }}>
      <SelectedTile
        row={2}
        column={3}
        tileWidth={50}
        tileHeight={30}
        ariaLabel="The aria label"
        focusOnly={boolean("Focus only", false)}
      >
        foo
      </SelectedTile>
    </div>
  ));
