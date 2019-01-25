import { range, random } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import TileCanvas from "..";
import { Color, GamePaletteTypes } from "../../../types";
import { GamePaletteWithColors } from "../../../reducer";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const PINK: Color = {
  id: 6,
  available: true,
  name: "Pink Luminosity Level 0",
  rgb: "#540400"
};

const GRAPE: Color = {
  id: 20,
  available: true,
  name: "Grape Luminosity Level 1",
  rgb: "#8814B0"
};

const JADE: Color = {
  id: 43,
  available: true,
  name: "Jade Luminosity Level 2",
  rgb: "#38CC6C"
};

const MID_GREY: Color = {
  id: 0,
  available: true,
  name: "Mid Grey #1",
  rgb: "#545454"
};

const BACKGROUND_PALETTE: GamePaletteWithColors = {
  type: GamePaletteTypes.BACKGROUND,
  id: 0,
  values: [PINK.id, GRAPE.id, JADE.id],
  colors: [PINK, GRAPE, JADE]
};

const PINK_PIXELS = new Uint8Array(64);
PINK_PIXELS.fill(1);

const GRAPE_PIXELS = new Uint8Array(64);
GRAPE_PIXELS.fill(2);

const JADE_PIXELS = new Uint8Array(64);
JADE_PIXELS.fill(3);

const RANDOM_PIXELS = Uint8Array.from(range(0, 64).map(() => random(0, 3)));

storiesOf("TileCanvas", module)
  .addDecorator(storyHost)
  .add("3 x 2", () => (
    <TileCanvas
      rows={3}
      columns={2}
      scaling={8 * 8}
      tiles={[
        PINK_PIXELS,
        PINK_PIXELS,
        GRAPE_PIXELS,
        GRAPE_PIXELS,
        JADE_PIXELS,
        JADE_PIXELS
      ].map(pixels => ({
        rowIndex: -1,
        columnIndex: -1,
        gamePaletteId: BACKGROUND_PALETTE.id,
        pixels
      }))}
      backgroundColor={MID_GREY}
      palettes={[BACKGROUND_PALETTE]}
      ariaLabel="The aria label"
    />
  ))
  .add("1 x 1", () => (
    <TileCanvas
      rows={1}
      columns={1}
      scaling={8 * 8 * 4}
      tiles={[RANDOM_PIXELS].map(pixels => ({
        rowIndex: -1,
        columnIndex: -1,
        gamePaletteId: BACKGROUND_PALETTE.id,
        pixels
      }))}
      backgroundColor={MID_GREY}
      palettes={[BACKGROUND_PALETTE]}
      ariaLabel="The aria label"
    />
  ));
