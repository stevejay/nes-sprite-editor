import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import { range, sample } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import BackgroundPatternTable from "../BackgroundPatternTable";
import {
  BACKGROUND_PALETTE,
  COLOR_ALMOST_WHITE,
  GRAPE_PIXELS,
  JADE_PIXELS,
  PINK_PIXELS
} from "../../../shared/TileCanvas/stories/constants";
import { MetatileSelection } from "../../../reducer";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store<MetatileSelection>({
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
    rowIndex: -1,
    columnIndex: -1,
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
          backgroundColor={COLOR_ALMOST_WHITE}
          palettes={PALETTES}
          onSelectMetatile={(row, column) => store.set({ row, column })}
        />
      )}
    </State>
  ));
