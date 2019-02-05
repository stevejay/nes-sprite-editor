import React from "react";
import TileCanvas from "../../shared/TileCanvas";
import { Nametable as NametableType, PatternTable } from "../../types";
import { GamePaletteCollectionWithColors } from "../../reducer";
import NametableCanvas from "./NametableCanvas";
import NametableCanvasInteractionTracker from "./NametableCanvasInteractionTracker";
import styles from "./Nametable.module.scss";
import RadioInput from "../../shared/RadioInput";
import {
  ViewportSize,
  RenderCanvasPositioning,
  createInitialRenderCanvasPositioning,
  adjustZoomOfRenderCanvas,
  ViewportCoord,
  zoomIntoRenderCanvas,
  zoomOutOfRenderCanvas,
  moveRenderCanvas
} from "./experiment";
import Button from "../../shared/Button";

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

export type ToolState = {
  toolType: Tool;
  toolData:
    | { paletteIndex: number }
    | { paletteIndex: number; colorIndex: number }
    | null;
  selected: { row: number; column: number } | null; // nulled when tool changed
  // viewArea: { top: number; left: number; width: number; height: number };
};

export enum ToolActionTypes {
  TOOL_SELECTED = "TOOL_SELECTED"
}

export type ToolAction = {
  type: ToolActionTypes.TOOL_SELECTED;
  payload: Tool;
};

type ScaleOption = {
  id: RenderCanvasPositioning["scale"];
  label: string;
};

const VIEWPORT_SIZE: ViewportSize = { width: 512, height: 512 };

const SCALE_OPTIONS: Array<ScaleOption> = [
  { id: 0.5, label: "50%" },
  { id: 1, label: "100%" },
  { id: 2, label: "200%" },
  { id: 4, label: "400%" },
  { id: 8, label: "800%" },
  { id: 16, label: "1600%" }
];

function toolReducer(state: ToolState, action: ToolAction): ToolState {
  switch (action.type) {
    case ToolActionTypes.TOOL_SELECTED:
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

export type RenderState = RenderCanvasPositioning;

export enum RenderActionTypes {
  INITIALIZE = "INITIALIZE",
  CHANGE_SCALE = "CHANGE_SCALE",
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  MOVE = "MOVE"
}

export type RenderAction =
  | {
      type: RenderActionTypes.CHANGE_SCALE;
      payload: RenderCanvasPositioning["scale"];
    }
  | { type: RenderActionTypes.INITIALIZE }
  | { type: RenderActionTypes.ZOOM_IN; payload: ViewportCoord }
  | { type: RenderActionTypes.ZOOM_OUT; payload: ViewportCoord }
  | { type: RenderActionTypes.MOVE; payload: ViewportCoord };

const RENDER_INITIAL_VALUE: RenderCanvasPositioning = {
  origin: { xLogicalPx: 0, yLogicalPx: 0 },
  size: { widthLogicalPx: 0, heightLogicalPx: 0 },
  scale: 1,
  viewportOffset: { xLogicalPx: 0, yLogicalPx: 0 }
};

function renderReducer(state: RenderState, action: RenderAction): RenderState {
  switch (action.type) {
    case RenderActionTypes.INITIALIZE:
      return createInitialRenderCanvasPositioning(VIEWPORT_SIZE);
    case RenderActionTypes.CHANGE_SCALE:
      return adjustZoomOfRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case RenderActionTypes.ZOOM_IN:
      return zoomIntoRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case RenderActionTypes.ZOOM_OUT:
      return zoomOutOfRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case RenderActionTypes.MOVE:
      return moveRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    default:
      return state;
  }
}

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

  const [renderState, renderDispatch] = React.useReducer<
    RenderState,
    RenderAction
  >(renderReducer, RENDER_INITIAL_VALUE, {
    type: RenderActionTypes.INITIALIZE
  });

  const [toolState, toolDispatch] = React.useReducer<ToolState, ToolAction>(
    toolReducer,
    {
      toolType: "zoomIn",
      toolData: null,
      selected: null
    }
  );

  return (
    <>
      <RadioInput.Group<Tool>
        legend="Selected tool:"
        options={TOOL_OPTIONS}
        selectedId={toolState.toolType}
        onChange={id =>
          toolDispatch({
            type: ToolActionTypes.TOOL_SELECTED,
            payload: id
          })
        }
      />
      <RadioInput.Group<RenderCanvasPositioning["scale"]>
        legend="Zoom level:"
        options={SCALE_OPTIONS}
        selectedId={renderState.scale}
        onChange={scale =>
          renderDispatch({
            type: RenderActionTypes.CHANGE_SCALE,
            payload: scale
          })
        }
      />
      <Button.Container>
        <Button
          onClick={() =>
            renderDispatch({
              type: RenderActionTypes.INITIALIZE
            })
          }
        >
          Reset View
        </Button>
      </Button.Container>
      <TileCanvas.Container>
        {/* <NametableCanvas
        viewportScaling={2}
        canvasScaling={1}
        nametable={nametable}
        patternTiles={patternTable.tiles}
        palettes={paletteCollection.gamePalettes}
        ariaLabel="Nametable tiles"
      /> */}
        <div className={styles.background} style={VIEWPORT_SIZE}>
          <NametableCanvasInteractionTracker
            viewportSize={VIEWPORT_SIZE}
            renderCanvasPositioning={renderState}
            toolType={toolState.toolType}
            dispatch={renderDispatch}
            // onSelect={(row, column, pressed) => {}}
          >
            <NametableCanvas
              viewportSize={VIEWPORT_SIZE}
              renderCanvasPositioning={renderState}
              // pixelScaling={pixelScaling}
              // canvasViewport={canvasViewport}
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
