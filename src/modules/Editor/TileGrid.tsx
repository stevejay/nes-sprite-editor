import React from "react";
import styles from "./TileGrid.module.scss";
import { TileGrid as TileGridType, Color } from "../../types";
import { GamePaletteWithColors, Position } from "../../reducer";

const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const SELECTION_TILE_COUNT = 2;
const GRID_TILE_ROWS = 16;
const GRID_TILE_COLUMNS = 16;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;

type Props = {
  tileGrid: TileGridType;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  gridScaling: number;
  selectedTile: Position;
  onSelectedTileChange: (selectedTile: Position) => void;
};

const TileGrid: React.FunctionComponent<Props> = ({
  tileGrid,
  backgroundColor,
  palettes,
  gridScaling,
  selectedTile,
  onSelectedTileChange
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const tileRef = React.useRef<HTMLDivElement | null>(null);

  const canvasSize = React.useMemo(
    () => ({
      width: TILE_PIXEL_WIDTH * GRID_TILE_ROWS * gridScaling,
      height: TILE_PIXEL_HEIGHT * GRID_TILE_COLUMNS * gridScaling
    }),
    [gridScaling]
  );

  React.useLayoutEffect(
    () => {
      if (!canvasRef || !canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      canvas.style.width = canvasSize.width + "px";
      canvas.style.height = canvasSize.height + "px";

      var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
      canvas.width = canvasSize.width * scale;
      canvas.height = canvasSize.height * scale;
      ctx.scale(scale, scale);

      tileGrid.tiles.forEach(tile => {
        const palette = palettes[tile.gamePaletteId];
        let rowIndex = -1;
        tile.pixels.forEach((pixelColorIndex, index) => {
          const columnIndex = index % 8;
          if (columnIndex === 0) {
            ++rowIndex;
          }

          const color =
            pixelColorIndex === 0
              ? backgroundColor
              : palette.colors[pixelColorIndex - 1];

          const rgbString = color.available ? color.rgb : "#000";

          ctx.fillStyle = rgbString;
          ctx.fillRect(
            (tile.columnIndex * 8 + columnIndex) * gridScaling,
            (tile.rowIndex * 8 + rowIndex) * gridScaling,
            gridScaling,
            gridScaling
          );
        });
      });
    },
    [tileGrid, backgroundColor, palettes, gridScaling]
  );

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = canvasRef!.current!.getBoundingClientRect();

    onSelectedTileChange([
      Math.floor(
        (event.clientX - boundingRect.left) /
          gridScaling /
          (8 * SELECTION_TILE_COUNT)
      ),
      Math.floor(
        (event.clientY - boundingRect.top) /
          gridScaling /
          (8 * SELECTION_TILE_COUNT)
      )
    ]);

    // if (tileRef && tileRef.current) {
    //   tileRef.current.focus();
    // }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === ARROW_UP) {
      event.preventDefault();
      if (selectedTile[1] > 0) {
        onSelectedTileChange([selectedTile[0], selectedTile[1] - 1]);
      }
    } else if (event.keyCode === ARROW_DOWN) {
      event.preventDefault();
      if (selectedTile[1] < GRID_TILE_ROWS / SELECTION_TILE_COUNT - 1) {
        onSelectedTileChange([selectedTile[0], selectedTile[1] + 1]);
      }
    } else if (event.keyCode === ARROW_LEFT) {
      event.preventDefault();
      if (selectedTile[0] > 0) {
        onSelectedTileChange([selectedTile[0] - 1, selectedTile[1]]);
      }
    } else if (event.keyCode === ARROW_RIGHT) {
      event.preventDefault();
      if (selectedTile[0] < GRID_TILE_COLUMNS / SELECTION_TILE_COUNT - 1) {
        onSelectedTileChange([selectedTile[0] + 1, selectedTile[1]]);
      }
    }
  };

  const focusSize = gridScaling * 8 * SELECTION_TILE_COUNT;

  return (
    <div
      className={styles.container}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
    >
      <canvas
        ref={canvasRef}
        style={canvasSize}
        className={styles.canvas}
        role="img"
        aria-label="Tile pattern grid"
      />
      <div
        ref={tileRef}
        className={styles.tileFocus}
        tabIndex={0}
        style={{
          left: selectedTile[0] * focusSize,
          top: selectedTile[1] * focusSize,
          width: `${focusSize}px`,
          height: `${focusSize}px`
        }}
      />
    </div>
  );
};

export default TileGrid;
