import { isNil } from "lodash";
import React from "react";
import CanvasHighlight from "./CanvasHighlight";
import CanvasInteractionTracker from "./CanvasInteractionTracker";
import {
  TilePosition,
  ViewportSize,
  ViewportCoord,
  convertViewportCoordToLogicalCoord
} from "./experiment";
import styles from "./PencilTool.module.scss";
import { Nametable, PatternTable } from "./store";
import {
  Action as ToolAction,
  ActionTypes as ToolActionTypes,
  State as ToolState
} from "./tool-reducer";
import { State as ViewportState } from "./viewport-reducer";
import {
  TILE_SIZE_PIXELS,
  TOTAL_NAMETABLE_X_TILES,
  TOTAL_NAMETABLE_Y_TILES
} from "./constants";

export type FlattenedLogicalCoord = {
  tileIndex: number;
  tilePixelIndex: number;
};

function convertViewportCoordToNametablePixel(
  renderCanvasPositioning: ViewportState,
  viewportCoord: ViewportCoord
): FlattenedLogicalCoord | null {
  const logicalCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    viewportCoord
  );

  const xTileIndex = Math.floor(logicalCoord.xLogicalPx / TILE_SIZE_PIXELS);
  const xTilePixelIndex = logicalCoord.xLogicalPx % TILE_SIZE_PIXELS;
  const yTileIndex = Math.floor(logicalCoord.yLogicalPx / TILE_SIZE_PIXELS);
  const yTilePixelIndex = logicalCoord.yLogicalPx % TILE_SIZE_PIXELS;

  if (
    xTileIndex < 0 ||
    xTileIndex >= TOTAL_NAMETABLE_X_TILES ||
    yTileIndex < 0 ||
    yTileIndex >= TOTAL_NAMETABLE_Y_TILES
  ) {
    return null;
  }

  return {
    tileIndex: yTileIndex * TOTAL_NAMETABLE_X_TILES + xTileIndex,
    tilePixelIndex: yTilePixelIndex * TILE_SIZE_PIXELS + xTilePixelIndex
  };
}

type Props = {
  currentTile: ToolState["currentTile"];
  selectedColorIndex: ToolState["selectedColorIndex"];
  viewportSize: ViewportSize;
  viewportState: ViewportState;
  toolDispatch: React.Dispatch<ToolAction>;
  isLocked: boolean;
  patternTable: PatternTable | null;
  nametable: Nametable | null;
  onChange: (
    id: string,
    tileIndex: number,
    startPixelIndex: number,
    newPixels: Array<number>
  ) => void;
};

const PencilTool = ({
  nametable,
  patternTable,
  currentTile,
  selectedColorIndex,
  viewportSize,
  viewportState,
  toolDispatch,
  isLocked,
  onChange
}: Props) => {
  const handleClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number
  ) => {
    if (isNil(patternTable) || isNil(nametable)) {
      return;
    }

    const flattenedLogicalCoord = convertViewportCoordToNametablePixel(
      viewportState,
      { x, y }
    );

    if (!flattenedLogicalCoord) {
      return;
    }

    onChange(
      patternTable.id,
      nametable.tileIndexes[flattenedLogicalCoord.tileIndex],
      flattenedLogicalCoord.tilePixelIndex,
      [selectedColorIndex]
    );
  };

  const handleMouseMove = (
    _event: React.MouseEvent<HTMLDivElement>,
    tilePosition: TilePosition
  ) => {
    if (currentTile.tileIndex !== tilePosition.tileIndex) {
      toolDispatch({
        type: ToolActionTypes.CURRENT_TILE_UPDATED,
        payload: tilePosition
      });
    }
  };

  const handleMouseLeave = () => {
    if (currentTile.tileIndex) {
      toolDispatch({
        type: ToolActionTypes.CURRENT_TILE_UPDATED,
        payload: { tileIndex: null, metatileIndex: null }
      });
    }
  };

  return (
    <CanvasInteractionTracker
      className={styles.tool}
      viewportSize={viewportSize}
      viewportState={viewportState}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <CanvasHighlight
        currentTile={currentTile}
        currentTool="pencil"
        viewportState={viewportState}
        isLocked={isLocked}
      />
    </CanvasInteractionTracker>
  );
};

export default PencilTool;
