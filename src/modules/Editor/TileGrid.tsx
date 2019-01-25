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

type FooProps = {
  children?: React.ReactNode;
  style: any;
  ariaLabel: string;
};

const SelectedTile: React.FunctionComponent<FooProps> = ({
  children,
  style,
  ariaLabel
}) => {
  const tileRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={tileRef}
      className={styles.tile}
      tabIndex={0}
      style={style}
      onClick={event => event.stopPropagation()}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

type Props = {
  tileGrid: TileGridType;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  gridScaling: number;
  selectedTile: Position;
  onSelectedTileChange: (selectedTile: Position) => void;
};

export const useSizedCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  rows: number,
  columns: number,
  scaling: number
) => {
  const canvasSize = React.useMemo(
    () => ({
      width: TILE_PIXEL_WIDTH * rows * scaling,
      height: TILE_PIXEL_HEIGHT * columns * scaling
    }),
    [scaling]
  );

  React.useLayoutEffect(
    () => {
      const canvas = canvasRef.current!;
      canvas.style.width = canvasSize.width + "px";
      canvas.style.height = canvasSize.height + "px";

      const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
      canvas.width = canvasSize.width * scale;
      canvas.height = canvasSize.height * scale;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
    },
    [canvasSize]
  );

  return canvasSize;
};

export function drawTile(
  ctx: CanvasRenderingContext2D,
  rowIndex: number,
  columnIndex: number,
  pixels: Uint8Array,
  colors: Array<Color>,
  scaling: number
) {
  let rowLoopIndex = -1;
  pixels.forEach((colorIndex, index) => {
    const columnLoopIndex = index % 8;
    if (columnLoopIndex === 0) {
      ++rowLoopIndex;
    }

    const color = colors[colorIndex];
    const rgbString = color.available ? color.rgb : "#000";

    ctx.fillStyle = rgbString;
    ctx.fillRect(
      (columnIndex * 8 + columnLoopIndex) * scaling,
      (rowIndex * 8 + rowLoopIndex) * scaling,
      scaling,
      scaling
    );
  });
}

const TileGrid: React.FunctionComponent<Props> = ({
  tileGrid,
  backgroundColor,
  palettes,
  gridScaling,
  selectedTile,
  onSelectedTileChange
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const canvasSize = useSizedCanvas(
    canvasRef,
    GRID_TILE_ROWS,
    GRID_TILE_COLUMNS,
    gridScaling
  );

  React.useLayoutEffect(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      tileGrid.tiles.forEach(tile => {
        const palette = palettes[tile.gamePaletteId];
        drawTile(
          ctx,
          tile.rowIndex,
          tile.columnIndex,
          tile.pixels,
          [backgroundColor, ...palette.colors],
          gridScaling
        );
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
      <SelectedTile
        ariaLabel={`Row number ${selectedTile[1]} and column number ${
          selectedTile[0]
        } selected`}
        style={{
          left: focusSize * 0.5,
          top: focusSize * 0.5,
          transform: `translate(calc(-50% + ${selectedTile[0] *
            focusSize}px), calc(-50% + ${selectedTile[1] * focusSize}px))`,
          width: `${focusSize}px`,
          height: `${focusSize}px`
        }}
      />
    </div>
  );
};

export default TileGrid;
