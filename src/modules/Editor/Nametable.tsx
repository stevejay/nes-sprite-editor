import React from "react";
import TileCanvas from "../../shared/TileCanvas";
import {
  Nametable as NametableType,
  PatternTable,
  GamePaletteCollectionWithColors
} from "./store";
import NametableCanvas from "./NametableCanvas";
import NametableCanvasInteractionTracker from "./NametableCanvasInteractionTracker";
import styles from "./Nametable.module.scss";
import {
  ViewportSize,
  RenderCanvasPositioning,
  createInitialRenderCanvasPositioning,
  adjustZoomOfRenderCanvas,
  ViewportCoord,
  zoomIntoRenderCanvas,
  zoomOutOfRenderCanvas,
  moveRenderCanvas,
  TilePosition
} from "./experiment";
import NametableToolbar from "./NametableToolbar";
import { isNil } from "lodash";

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
  currentTile: {
    tileIndex: number | null;
    metatileIndex: number | null;
  };
  selected: { row: number; column: number } | null; // nulled when tool changed
};

export enum ToolActionTypes {
  PENCIL_SELECTED = "PENCIL_SELECTED",
  TOOL_SELECTED = "TOOL_SELECTED",
  PALETTE_SELECTED = "PALETTE_SELECTED",
  COLOR_SELECTED = "COLOR_SELECTED",
  CURRENT_TILE_UPDATED = "CURRENT_TILE_UPDATED"
}

export type ToolAction =
  | {
      type: ToolActionTypes.PENCIL_SELECTED;
      payload: { colorIndex: ToolState["selectedColorIndex"] };
    }
  | {
      type: ToolActionTypes.TOOL_SELECTED;
      payload: Tool;
    }
  | {
      type: ToolActionTypes.PALETTE_SELECTED;
      payload: { paletteIndex: ToolState["selectedPaletteIndex"] };
    }
  | {
      type: ToolActionTypes.COLOR_SELECTED;
      payload: ToolState["selectedColorIndex"];
    }
  | {
      type: ToolActionTypes.CURRENT_TILE_UPDATED;
      payload: TilePosition;
    };

function toolReducer(state: ToolState, action: ToolAction): ToolState {
  switch (action.type) {
    case ToolActionTypes.PENCIL_SELECTED:
      return {
        ...state,
        currentTool: "pencil",
        selectedColorIndex: action.payload.colorIndex,
        currentTile: {
          tileIndex: null,
          metatileIndex: null
        }
      };
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
        currentTool: "palette",
        selectedPaletteIndex: action.payload.paletteIndex,
        currentTile: {
          tileIndex: null,
          metatileIndex: null
        }
      };
    case ToolActionTypes.CURRENT_TILE_UPDATED:
      return {
        ...state,
        currentTile: action.payload
      };
    default:
      return state;
  }
}

const VIEWPORT_SIZE: ViewportSize = { width: 512, height: 512 };

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
  currentTile: {
    tileIndex: null,
    metatileIndex: null
  },
  selected: null
};

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  onChangePatternTable: (
    id: string,
    tileIndex: number,
    startPixelIndex: number,
    newPixels: Array<number>
  ) => void;
  onChangePalette: (id: string, paletteIndex: number, newIndex: number) => void;
  onChangeTile: (id: string, tileIndex: number, newValue: number) => void;
};

const Nametable = ({
  nametable,
  patternTable,
  paletteCollection,
  onChangePatternTable,
  onChangePalette,
  onChangeTile
}: Props) => {
  if (!nametable || !patternTable || !paletteCollection) {
    return null;
  }

  const [renderState, renderDispatch] = React.useReducer(
    renderReducer,
    initializeReducer()
  );

  const [toolState, toolDispatch] = React.useReducer(
    toolReducer,
    INITIAL_TOOL_STATE
  );

  const currentPalette = !isNil(toolState.currentTile.metatileIndex)
    ? paletteCollection.gamePalettes[
        nametable.paletteIndexes[toolState.currentTile.metatileIndex]
      ]
    : // TODO should this just be gamePalettes[0]?
      paletteCollection.gamePalettes[toolState.selectedPaletteIndex];

  return (
    <>
      <NametableToolbar
        toolDispatch={toolDispatch}
        tool={toolState.currentTool}
        colorIndex={toolState.selectedColorIndex}
        paletteIndex={toolState.selectedPaletteIndex}
        currentPalette={currentPalette}
        scale={renderState.scale}
        onReset={() =>
          renderDispatch({
            type: RenderActionTypes.INITIALIZE
          })
        }
        onSetScale={scale =>
          renderDispatch({
            type: RenderActionTypes.CHANGE_SCALE,
            payload: scale
          })
        }
      />
      <TileCanvas.Container>
        <div className={styles.background} style={VIEWPORT_SIZE}>
          <NametableCanvasInteractionTracker
            viewportSize={VIEWPORT_SIZE}
            nametable={nametable}
            patternTable={patternTable}
            renderCanvasPositioning={renderState}
            currentTool={toolState.currentTool}
            currentPalette={currentPalette}
            selectedColorIndex={toolState.selectedColorIndex}
            selectedPaletteIndex={toolState.selectedPaletteIndex}
            currentTile={toolState.currentTile}
            renderDispatch={renderDispatch}
            toolDispatch={toolDispatch}
            onChangePatternTable={onChangePatternTable}
            onChangePalette={onChangePalette}
            onChangeTile={onChangeTile}
          >
            <NametableCanvas
              viewportSize={VIEWPORT_SIZE}
              renderCanvasPositioning={renderState}
              nametable={nametable}
              patternTiles={patternTable.tiles}
              palettes={paletteCollection.gamePalettes}
              aria-label="Nametable tiles"
            />
          </NametableCanvasInteractionTracker>
        </div>
      </TileCanvas.Container>
    </>
  );
};

export default Nametable;
