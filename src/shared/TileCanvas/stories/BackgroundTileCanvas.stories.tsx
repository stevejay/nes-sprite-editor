import { TileCanvas } from "..";
import { State, Store } from "@sambego/storybook-state";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { range, sample } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import { GamePaletteWithColors } from "../../../reducer";
import { Color, Tile } from "../../../types";
import { TileInteractionTracker } from "..";
import { SelectedTile } from "..";
import {
  BACKGROUND_PALETTE,
  COLOR_ALMOST_WHITE,
  GRAPE_PIXELS,
  JADE_PIXELS,
  PINK_PIXELS
} from "./constants";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
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

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  metatileSize: number;
  scaling: number;
  tiles: Array<Tile>;
  selectedMetatile: {
    row: number;
    column: number;
  };
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  onChange: (row: number, column: number) => void;
};

const BackgroundPatternTable: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  metatileSize = 1,
  scaling,
  tiles,
  selectedMetatile,
  backgroundColor,
  palettes,
  onChange
}) => (
  <div style={{ display: "inline-block" }}>
    <TileInteractionTracker
      rows={tilesInRow / metatileSize}
      columns={tilesInColumn / metatileSize}
      row={selectedMetatile.row}
      column={selectedMetatile.column}
      onChange={onChange}
    >
      <TileCanvas
        tilesInRow={tilesInRow}
        tilesInColumn={tilesInColumn}
        scaling={scaling}
        tiles={tiles}
        backgroundColor={backgroundColor}
        palettes={palettes}
        ariaLabel="The aria label"
      />
      <SelectedTile
        tileWidth={8 * scaling * metatileSize}
        tileHeight={8 * scaling * metatileSize}
        row={selectedMetatile.row}
        column={selectedMetatile.column}
        ariaLabel={`Metatile row ${selectedMetatile.row}, column ${
          selectedMetatile.column
        }`}
      />
    </TileInteractionTracker>
  </div>
);

storiesOf("TileCanvas/BackgroundPatternTable", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <BackgroundPatternTable
          tilesInRow={ROWS}
          tilesInColumn={COLUMNS}
          metatileSize={boolean("Metatiles", true) ? 2 : 1}
          scaling={4}
          tiles={TILES}
          selectedMetatile={state}
          backgroundColor={COLOR_ALMOST_WHITE}
          palettes={PALETTES}
          onChange={(row, column) => store.set({ row, column })}
        />
      )}
    </State>
  ));
