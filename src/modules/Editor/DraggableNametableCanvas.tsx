import React from "react";
import Draggable from "react-draggable";
import {
  ActionTypes as ViewportActionTypes,
  State as ViewportState,
  Action as ViewportAction
} from "./viewport-reducer";
import { State as ToolState } from "./tool-reducer";
import { ViewportSize } from "./experiment";
import { Nametable, GamePaletteWithColors, PatternTable } from "./store";
import NametableCanvas from "./NametableCanvas";

const DRAG_POSITION = { x: 0, y: 0 };

type Props = {
  viewportSize: ViewportSize;
  nametable: Nametable;
  gamePalettes: Array<GamePaletteWithColors>;
  patternTable: PatternTable;
  currentTool: ToolState["currentTool"];
  viewportState: ViewportState;
  viewportDispatch: React.Dispatch<ViewportAction>;
};

const DraggableNametableCanvas = ({
  viewportSize,
  nametable,
  patternTable,
  gamePalettes,
  currentTool,
  viewportState,
  viewportDispatch
}: Props) => {
  const allowDragging = currentTool === "move";
  return (
    <Draggable
      position={DRAG_POSITION}
      disabled={!allowDragging}
      onStop={(_event, data) => {
        viewportDispatch({
          type: ViewportActionTypes.MOVE,
          payload: { x: -data.x, y: -data.y }
        });
      }}
    >
      <NametableCanvas
        viewportSize={viewportSize}
        renderCanvasPositioning={viewportState}
        nametable={nametable}
        patternTiles={patternTable.tiles}
        palettes={gamePalettes}
        aria-label="Nametable tiles"
      />
    </Draggable>
  );
};

export default DraggableNametableCanvas;
