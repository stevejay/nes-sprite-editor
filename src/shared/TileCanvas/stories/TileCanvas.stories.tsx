import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import { TileCanvas } from "..";
import {
  PINK_PIXELS,
  GRAPE_PIXELS,
  JADE_PIXELS,
  BACKGROUND_PALETTE,
  RANDOM_PIXELS
} from "./constants";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("TileCanvas/TileCanvas", module)
  .addDecorator(storyHost)
  .add("3 x 2", () => (
    <TileCanvas
      tilesInRow={3}
      tilesInColumn={2}
      scaling={8}
      tiles={[
        PINK_PIXELS,
        PINK_PIXELS,
        GRAPE_PIXELS,
        GRAPE_PIXELS,
        JADE_PIXELS,
        JADE_PIXELS
      ].map(pixels => ({
        pixels
      }))}
      palettes={[BACKGROUND_PALETTE]}
      ariaLabel="The aria label"
    />
  ))
  .add("1 x 1", () => (
    <TileCanvas
      tilesInRow={1}
      tilesInColumn={1}
      scaling={16}
      tiles={[RANDOM_PIXELS].map(pixels => ({
        pixels
      }))}
      palettes={[BACKGROUND_PALETTE]}
      ariaLabel="The aria label"
    />
  ));
