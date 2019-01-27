import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import { range, sample } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import BackgroundPatternTable from "../BackgroundPatternTable";
import {
  BACKGROUND_PALETTE,
  GRAPE_PIXELS,
  JADE_PIXELS,
  PINK_PIXELS
} from "../../../shared/TileCanvas/stories/constants";
import { Metatile } from "../../../types";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store<Metatile>({
  metatileSize: 2,
  row: 0,
  column: 0
});

const ROWS = 12;
const COLUMNS = 16;
const PALETTES = [BACKGROUND_PALETTE];

const TILES = range(0, ROWS * COLUMNS)
  .map(() => sample([GRAPE_PIXELS, JADE_PIXELS, PINK_PIXELS]))
  .map(pixels => ({
    row: -1,
    column: -1,
    gamePaletteId: BACKGROUND_PALETTE.id,
    pixels: pixels!
  }));

storiesOf("Editor/BackgroundPatternTable", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <BackgroundPatternTable
          tilesInRow={ROWS}
          tilesInColumn={COLUMNS}
          scaling={4}
          tiles={TILES}
          currentMetatile={state}
          palettes={PALETTES}
          onSelectMetatile={(row, column) => store.set({ row, column })}
        />
      )}
    </State>
  ));
