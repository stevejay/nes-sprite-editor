import React from "react";
import TileCanvas from "../../../shared/TileCanvas";
import {
  PatternTable as PatternTableType,
  GamePaletteCollectionWithColors,
  GamePaletteWithColors
} from "../store";
import PatternTableCanvas from "./PatternTableCanvas";
import {
  TILE_SIZE_PIXELS,
  PATTERN_TABLE_ROWS,
  PATTERN_TABLE_COLUMNS
} from "../constants";

// import Draggable, { DraggableEventHandler } from "react-draggable";
// import DraggableTile from "./DraggableTile";
// const DRAG_POSITION = { x: 0, y: 0 };

// const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;

// function useTrackingTile(
//   containerRef: React.RefObject<HTMLElement>,
//   scale: number
// ) {
//   const [index, setIndex] = React.useState(0);
//   const [tracking, setTracking] = React.useState(true);

//   const onMouseMove = React.useCallback(
//     (event: React.MouseEvent<HTMLDivElement>) => {
//       if (!tracking || !containerRef) {
//         return undefined;
//       }
//       const boundingRect = containerRef.current!.getBoundingClientRect();
//       const yInContainer = event.clientY - boundingRect.top;
//       const xInContainer = event.clientX - boundingRect.left;
//       const column = Math.floor(
//         xInContainer / (PIXEL_COLUMNS_PER_TILE * scale)
//       );
//       const row = Math.floor(yInContainer / (PIXEL_ROWS_PER_TILE * scale));
//       const newIndex = column + row * 16;
//       if (newIndex !== index) {
//         setIndex(newIndex);
//       }
//     },
//     [index]
//   );

//   const onMouseDown = () => setTracking(false);
//   const onMouseUp = () => setTracking(true);
//   return [index, tracking ? onMouseMove : undefined, onMouseDown, onMouseUp];
// }

type Props = {
  scale: number;
  patternTable: PatternTableType;
  palette: GamePaletteWithColors;
  tileIndex: number;
  onSelectTile: (index: number) => void;
};

// TODO prevent rendering when possible
const PatternTable = ({
  scale,
  patternTable,
  palette,
  tileIndex,
  onSelectTile
}: Props) => {
  const row = Math.floor(tileIndex / PATTERN_TABLE_COLUMNS);
  const column = tileIndex % PATTERN_TABLE_COLUMNS;
  return (
    <TileCanvas.Container>
      <TileCanvas.InteractionTracker
        rows={PATTERN_TABLE_ROWS}
        columns={PATTERN_TABLE_COLUMNS}
        row={row}
        column={column}
        onSelect={(row, column) => {
          onSelectTile(row * PATTERN_TABLE_COLUMNS + column);
        }}
      >
        <PatternTableCanvas
          tilesInRow={PATTERN_TABLE_ROWS}
          tilesInColumn={PATTERN_TABLE_COLUMNS}
          scale={scale}
          tiles={patternTable.tiles}
          palette={palette}
          aria-label="Pattern table tiles"
        />
        <TileCanvas.Highlight
          tileWidth={TILE_SIZE_PIXELS * scale}
          tileHeight={TILE_SIZE_PIXELS * scale}
          row={row}
          column={column}
          aria-label={`Tile ${tileIndex}, row ${row}, column ${column}`}
        />
      </TileCanvas.InteractionTracker>
    </TileCanvas.Container>
  );
};

export default PatternTable;

//   <PatternTableCanvas
//   tilesInRow={16}
//   tilesInColumn={16}
//   scale={scale}
//   tiles={patternTable.tiles}
//   palette={paletteCollection.gamePalettes[0]}
//   ariaLabel="Pattern table tiles"
// />

/* <PatternTableCanvas
tilesInRow={1}
tilesInColumn={1}
scale={scale}
tiles={[
  patternTable.tiles[currentTile.row * 16 + currentTile.column]
]}
palette={paletteCollection.gamePalettes[0]}
ariaLabel="Pattern table tiles"
/> */

/* <Draggable
          bounds="parent"
          grid={[
            scale * PIXEL_ROWS_PER_TILE * 0.5,
            scale * PIXEL_COLUMNS_PER_TILE
          ]}
        >
          <DraggableTile
            row={currentTile.row}
            column={currentTile.column}
            scale={scale}
            tile={patternTable.tiles[currentTile.row * 16 + currentTile.column]}
            palette={paletteCollection.gamePalettes[0]}
            ariaLabel="Pattern table tiles"
          />
        </Draggable> */
