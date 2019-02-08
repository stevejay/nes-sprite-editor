import React from "react";
import TileCanvas from "../../shared/TileCanvas";
import {
  Nametable as NametableType,
  PatternTable,
  GamePaletteCollectionWithColors
} from "../../types";
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
import { Action } from "../../contexts/editor";

export type PaletteOption = {
  id: number;
  label: string;
};

const PALETTE_OPTIONS: Array<PaletteOption> = [
  { id: 0, label: "#0" },
  { id: 1, label: "#1" },
  { id: 2, label: "#2" },
  { id: 3, label: "#3" }
];

export type ColorIndexOption = {
  id: number;
  label: string;
};

const COLOR_INDEX_OPTIONS: Array<ColorIndexOption> = [
  { id: 0, label: "0" },
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 3, label: "3" }
];

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
  currentTool: Tool;
  selectedPaletteIndex: number;
  selectedColorIndex: number;
  currentMetatileIndex: number | null;
  selected: { row: number; column: number } | null; // nulled when tool changed
  // viewArea: { top: number; left: number; width: number; height: number };
};

export enum ToolActionTypes {
  TOOL_SELECTED = "TOOL_SELECTED",
  PALETTE_SELECTED = "PALETTE_SELECTED",
  COLOR_SELECTED = "COLOR_SELECTED",
  CURRENT_METATILE_UPDATED = "CURRENT_METATILE_UPDATED"
}

export type ToolAction =
  | {
      type: ToolActionTypes.TOOL_SELECTED;
      payload: Tool;
    }
  | {
      type: ToolActionTypes.PALETTE_SELECTED;
      payload: ToolState["selectedPaletteIndex"];
    }
  | {
      type: ToolActionTypes.COLOR_SELECTED;
      payload: ToolState["selectedColorIndex"];
    }
  | {
      type: ToolActionTypes.CURRENT_METATILE_UPDATED;
      payload: ToolState["currentMetatileIndex"];
    };

type ScaleOption = {
  id: RenderCanvasPositioning["scale"];
  label: string;
};

function toolReducer(state: ToolState, action: ToolAction): ToolState {
  switch (action.type) {
    case ToolActionTypes.TOOL_SELECTED:
      const currentTool = action.payload;
      if (currentTool === state.currentTool) {
        return state;
      }
      return { ...state, currentTool };
    case ToolActionTypes.COLOR_SELECTED:
      return {
        ...state,
        selectedColorIndex: action.payload
      };
    case ToolActionTypes.PALETTE_SELECTED:
      return {
        ...state,
        selectedPaletteIndex: action.payload
      };
    case ToolActionTypes.CURRENT_METATILE_UPDATED:
      return {
        ...state,
        currentMetatileIndex: action.payload
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
  { id: "pencil", label: "Pencil" },
  { id: "palette", label: "Palette" },
  { id: "move", label: "Move" },
  { id: "zoomIn", label: "Zoom in" },
  { id: "zoomOut", label: "Zoom out" }
];

const VIEWPORT_SIZE: ViewportSize = { width: 512, height: 512 };

const SCALE_OPTIONS: Array<ScaleOption> = [
  { id: 0.5, label: "50%" },
  { id: 1, label: "100%" },
  { id: 2, label: "200%" },
  { id: 4, label: "400%" },
  { id: 8, label: "800%" },
  { id: 16, label: "1600%" }
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

function initializeReducer(): RenderState {
  return createInitialRenderCanvasPositioning(VIEWPORT_SIZE);
}

function renderReducer(state: RenderState, action: RenderAction): RenderState {
  switch (action.type) {
    case RenderActionTypes.INITIALIZE:
      return initializeReducer();
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

const INITIAL_TOOL_STATE: ToolState = {
  currentTool: "zoomIn",
  selectedPaletteIndex: 0,
  selectedColorIndex: 0,
  currentMetatileIndex: null,
  selected: null
};

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const Nametable: React.FunctionComponent<Props> = ({
  nametable,
  patternTable,
  paletteCollection,
  dispatch
}) => {
  if (!nametable || !patternTable || !paletteCollection) {
    return null;
  }

  const [renderState, renderDispatch] = React.useReducer<
    RenderState,
    RenderAction
  >(renderReducer, initializeReducer());

  const [toolState, toolDispatch] = React.useReducer<ToolState, ToolAction>(
    toolReducer,
    INITIAL_TOOL_STATE
  );

  return (
    <>
      <div className={styles.toolbarRow}>
        <div className={styles.toolbarColumn}>
          <RadioInput.Group<Tool>
            legend="Selected tool:"
            options={TOOL_OPTIONS}
            selectedId={toolState.currentTool}
            onChange={id =>
              toolDispatch({
                type: ToolActionTypes.TOOL_SELECTED,
                payload: id
              })
            }
          />
        </div>
        <div className={styles.toolbarColumn}>
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
        </div>
        <div className={styles.toolbarColumn}>
          <RadioInput.Group<ToolState["selectedPaletteIndex"]>
            legend="Palette:"
            options={PALETTE_OPTIONS}
            selectedId={toolState.selectedPaletteIndex}
            onChange={index =>
              toolDispatch({
                type: ToolActionTypes.PALETTE_SELECTED,
                payload: index
              })
            }
          />
        </div>
        <div className={styles.toolbarColumn}>
          <RadioInput.Group<ToolState["selectedColorIndex"]>
            legend="Color:"
            options={COLOR_INDEX_OPTIONS}
            selectedId={toolState.selectedColorIndex}
            onChange={index =>
              toolDispatch({
                type: ToolActionTypes.COLOR_SELECTED,
                payload: index
              })
            }
          />
        </div>
      </div>
      <TileCanvas.Container>
        <div className={styles.background} style={VIEWPORT_SIZE}>
          <NametableCanvasInteractionTracker
            viewportSize={VIEWPORT_SIZE}
            nametable={nametable}
            patternTable={patternTable}
            renderCanvasPositioning={renderState}
            currentTool={toolState.currentTool}
            selectedColorIndex={toolState.selectedColorIndex}
            currentMetatileIndex={toolState.currentMetatileIndex}
            renderDispatch={renderDispatch}
            toolDispatch={toolDispatch}
            dispatch={dispatch}
          >
            <NametableCanvas
              viewportSize={VIEWPORT_SIZE}
              renderCanvasPositioning={renderState}
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
