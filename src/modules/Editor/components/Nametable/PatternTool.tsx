import { isNil } from "lodash";
import React from "react";
import CanvasHighlight from "./CanvasHighlight";
import CanvasInteractionTracker from "./CanvasInteractionTracker";
import { TilePosition, ViewportSize } from "./experiment";
import styles from "./PatternTool.module.scss";
import { Nametable } from "../../store";
import {
  Action as ToolAction,
  ActionTypes as ToolActionTypes,
  State as ToolState
} from "./tool-reducer";
import { State as ViewportState } from "./viewport-reducer";

type Props = {
  currentTile: ToolState["currentTile"];
  selectedColorIndex: ToolState["selectedColorIndex"];
  viewportSize: ViewportSize;
  viewportState: ViewportState;
  toolDispatch: React.Dispatch<ToolAction>;
  isLocked: boolean;
  nametable: Nametable | null;
  tileIndex: number;
  onChange: (id: string, tileIndex: number, newValue: number) => void;
};

const PatternTool = ({
  nametable,
  currentTile,
  viewportSize,
  viewportState,
  tileIndex,
  toolDispatch,
  isLocked,
  onChange
}: Props) => {
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

  const handleClick = React.useCallback(() => {
    if (isNil(nametable) || isNil(currentTile.tileIndex)) {
      return;
    }
    onChange(nametable.id, currentTile.tileIndex, tileIndex);
  }, [onChange, nametable, currentTile, tileIndex]);

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
        currentTool="pattern"
        viewportState={viewportState}
        isLocked={isLocked}
      />
    </CanvasInteractionTracker>
  );
};

export default PatternTool;
