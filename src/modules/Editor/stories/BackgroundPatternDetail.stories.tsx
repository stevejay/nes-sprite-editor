import { storiesOf } from "@storybook/react";
import { range } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import BackgroundPatternDetail from "../BackgroundPatternDetail";
import {
  BACKGROUND_PALETTE,
  COLOR_ALMOST_WHITE,
  RANDOM_PIXELS
} from "../../../shared/TileCanvas/stories/constants";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const PALETTES = [BACKGROUND_PALETTE];

const TILES = range(0, 4).map(() => ({
  row: -1,
  column: -1,
  gamePaletteId: BACKGROUND_PALETTE.id,
  pixels: RANDOM_PIXELS
}));

storiesOf("Editor/BackgroundPatternDetail", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <BackgroundPatternDetail
      tilesInRow={2}
      tilesInColumn={2}
      scaling={20}
      tiles={TILES}
      currentMetatile={{
        metatileSize: 2,
        row: 0,
        column: 0
      }}
      palettes={PALETTES}
    />
  ));
