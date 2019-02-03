import React from "react";
import TileCanvas from "../../shared/TileCanvas";
import { Nametable as NametableType, PatternTable } from "../../types";
import { GamePaletteCollectionWithColors } from "../../reducer";
import NametableCanvas from "./NametableCanvas";
import NametableCanvasInteractionTracker from "./NametableCanvasInteractionTracker";
import styles from "./Nametable.module.scss";
import RadioInput from "../../shared/RadioInput";

// visible tile area in canvas viewport
export type CanvasViewport = {
  scaling: 1 | 2 | 4 | 8 | 16;
  topTile: number;
  leftTile: number;
};

export type PixelScaling = 1 | 2 | 3;

export type Tool =
  | "palette"
  | "pattern"
  | "pencil"
  | "zoomIn"
  | "zoomOut"
  | "move";

export type State = {
  toolType: Tool;
  toolData:
    | { paletteIndex: number }
    | { paletteIndex: number; colorIndex: number }
    | null;
  selected: { row: number; column: number } | null; // nulled when tool changed
  // viewArea: { top: number; left: number; width: number; height: number };
};

export enum ActionTypes {
  TOOL_SELECTED = "TOOL_SELECTED"
}

export type Action = {
  type: ActionTypes.TOOL_SELECTED;
  payload: Tool;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.TOOL_SELECTED:
      const toolType = action.payload;
      if (toolType === state.toolType) {
        return state;
      }
      return {
        ...state,
        toolType,
        toolData: null, // TODO
        selected: null // TODO
      };
    default:
      return state;
  }
}

type ToolOption = {
  id: Tool;
  label: string;
};
const TOOL_OPTIONS: Array<ToolOption> = [
  { id: "move", label: "Move" },
  { id: "zoomIn", label: "Zoom in" },
  { id: "zoomOut", label: "Zoom out" }
];

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  // currentTool: string;
};

const Nametable: React.FunctionComponent<Props> = ({
  nametable,
  patternTable,
  paletteCollection
}) => {
  if (!nametable || !patternTable || !paletteCollection) {
    return null;
  }

  const [toolState, toolDispatch] = React.useReducer<State, Action>(reducer, {
    toolType: "move",
    toolData: null,
    selected: null
  });

  const [canvasViewport, setCanvasViewport] = React.useState<CanvasViewport>({
    scaling: 2,
    topTile: 0,
    leftTile: 0
  });

  const pixelScaling: PixelScaling = 2;

  return (
    <>
      <RadioInput.Group<Tool>
        legend="Selected tool:"
        options={TOOL_OPTIONS}
        selectedId={toolState.toolType}
        onChange={id =>
          toolDispatch({
            type: ActionTypes.TOOL_SELECTED,
            payload: id
          })
        }
      />
      <TileCanvas.Container>
        {/* <NametableCanvas
        viewportScaling={2}
        canvasScaling={1}
        nametable={nametable}
        patternTiles={patternTable.tiles}
        palettes={paletteCollection.gamePalettes}
        ariaLabel="Nametable tiles"
      /> */}
        <div
          className={styles.background}
          style={{
            width: pixelScaling * 8 * 32,
            height: pixelScaling * 8 * 32
          }}
        >
          <NametableCanvasInteractionTracker
            pixelScaling={pixelScaling}
            canvasViewport={canvasViewport}
            toolType={toolState.toolType}
            // onSelect={(row, column, pressed) => {}}
          >
            <NametableCanvas
              pixelScaling={pixelScaling}
              canvasViewport={canvasViewport}
              nametable={nametable}
              patternTiles={patternTable.tiles}
              palettes={paletteCollection.gamePalettes}
              ariaLabel="Nametable tiles"
            />
          </NametableCanvasInteractionTracker>
        </div>
      </TileCanvas.Container>
    </>
  );
};

/* <TileCanvas.Highlight
          tileWidth={16 * scaling}
          tileHeight={16 * scaling}
          row={currentTile.row}
          column={currentTile.column}
          ariaLabel={`Metatile row ${currentTile.row}, column ${
            currentTile.column
          }`}
        /> */

export default Nametable;
