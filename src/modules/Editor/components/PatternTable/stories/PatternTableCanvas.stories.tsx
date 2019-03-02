import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../../../index.scss";
import {
  PINK_PIXELS,
  GRAPE_PIXELS,
  JADE_PIXELS,
  BACKGROUND_PALETTE,
  RANDOM_PIXELS
} from "./constants";
import PatternTableCanvas from "../PatternTableCanvas";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("PatternTableCanvas", module)
  .addDecorator(storyHost)
  .add("3 x 2", () => (
    <PatternTableCanvas
      scale={8}
      tiles={[
        PINK_PIXELS,
        PINK_PIXELS,
        GRAPE_PIXELS,
        GRAPE_PIXELS,
        JADE_PIXELS,
        JADE_PIXELS
      ].map(pixels => ({
        pixels,
        isLocked: true
      }))}
      palette={BACKGROUND_PALETTE}
    />
  ))
  .add("1 x 1", () => (
    <PatternTableCanvas
      scale={16}
      tiles={[RANDOM_PIXELS].map(pixels => ({
        pixels,
        isLocked: true
      }))}
      palette={BACKGROUND_PALETTE}
      aria-label="The aria label"
    />
  ));
