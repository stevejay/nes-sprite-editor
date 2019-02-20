import { isNil } from "lodash";
import React from "react";
import CanvasHighlight from "./CanvasHighlight";
import CanvasInteractionTracker from "./CanvasInteractionTracker";
import { TilePosition, ViewportSize } from "./experiment";
import styles from "./PaletteTool.module.scss";
import { Nametable } from "../../store";
import {
  Action as ToolAction,
  ActionTypes as ToolActionTypes,
  State as ToolState
} from "./tool-reducer";
import { State as ViewportState } from "./viewport-reducer";

type Props = {
  currentTile: ToolState["currentTile"];
  selectedPaletteIndex: ToolState["selectedPaletteIndex"];
  viewportSize: ViewportSize;
  viewportState: ViewportState;
  toolDispatch: React.Dispatch<ToolAction>;
  isLocked: boolean;
  nametable: Nametable | null;
  onChange: (id: string, paletteIndex: number, newIndex: number) => void;
};

const PaletteTool = ({
  nametable,
  currentTile,
  selectedPaletteIndex,
  viewportSize,
  viewportState,
  toolDispatch,
  isLocked,
  onChange
}: Props) => {
  const handleClick = () => {
    if (isNil(currentTile.metatileIndex) || isNil(nametable)) {
      return;
    }
    onChange(nametable.id, currentTile.metatileIndex, selectedPaletteIndex);
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
        currentTool="palette"
        viewportState={viewportState}
        isLocked={isLocked}
      />
    </CanvasInteractionTracker>
  );
};

export default PaletteTool;
