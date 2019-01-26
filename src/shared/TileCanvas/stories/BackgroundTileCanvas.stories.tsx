import * as React from "react";
import { range, sample, clamp } from "lodash";
import { host } from "storybook-host";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import TileCanvas from "..";
import GridInteractionTracker, {
  Props as TrackerProps
} from "../GridInteractionTracker";
import {
  PINK_PIXELS,
  GRAPE_PIXELS,
  JADE_PIXELS,
  BACKGROUND_PALETTE,
  COLOR_ALMOST_WHITE
} from "./constants";
import SelectedTile from "../SelectedTile";
import { Tile, Color } from "../../../types";
import { GamePaletteWithColors } from "../../../reducer";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  selected: {
    row: 0,
    column: 0
  }
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
  selected: {
    row: number;
    column: number;
  };
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  onChange: (row: number, column: number) => void;
};

const BackgroundTileCanvas: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  metatileSize = 1,
  scaling,
  tiles,
  selected,
  backgroundColor,
  palettes,
  onChange
}) => {
  const handleChange: TrackerProps["onChange"] = (type, value) => {
    if (type === "absolute") {
      onChange(value.row, value.column);
    } else if (type === "delta") {
      onChange(
        clamp(selected.row + value.row, 0, tilesInRow / metatileSize - 1),
        clamp(
          selected.column + value.column,
          0,
          tilesInColumn / metatileSize - 1
        )
      );
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <GridInteractionTracker
        rows={tilesInRow / metatileSize}
        columns={tilesInColumn / metatileSize}
        onChange={handleChange}
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
          tileWidth={scaling * metatileSize * 8}
          tileHeight={scaling * metatileSize * 8}
          row={selected.row}
          column={selected.column}
          ariaLabel={`Metatile row ${selected.row}, column ${selected.column}`}
        />
      </GridInteractionTracker>
    </div>
  );
};

storiesOf("TileCanvas/BackgroundTileCanvas", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <BackgroundTileCanvas
          tilesInRow={ROWS}
          tilesInColumn={COLUMNS}
          metatileSize={boolean("Metatiles", true) ? 2 : 1}
          scaling={4}
          tiles={TILES}
          selected={state.selected}
          backgroundColor={COLOR_ALMOST_WHITE}
          palettes={PALETTES}
          onChange={(row, column) => store.set({ selected: { row, column } })}
        />
      )}
    </State>
  ));
