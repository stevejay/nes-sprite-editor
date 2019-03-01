import React from "react";
import { FiMove, FiSquare, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import Button from "../../../../shared/Button";
import SelectInput from "../../../../shared/SelectInput";
import useId from "../../../../shared/utils/use-id";
import {
  GamePaletteCollectionWithColors,
  GamePaletteWithColors
} from "../../store";
import PaletteSelectionToolbar from "../PaletteSelectionToolbar";
import PencilSelectionToolbar from "../PencilSelectionToolbar";
import Toolbar from "../Toolbar";
import { RenderCanvasPositioning } from "./experiment";
import {
  Action as ToolAction,
  ActionTypes as ToolActionTypes,
  State as ToolState
} from "./tool-reducer";

type ScaleOption = {
  id: RenderCanvasPositioning["scale"];
  label: string;
};

const SCALE_OPTIONS: Array<ScaleOption> = [
  { id: 0.5, label: "50%" },
  { id: 1, label: "100%" },
  { id: 2, label: "200%" },
  { id: 4, label: "400%" },
  { id: 8, label: "800%" },
  { id: 16, label: "1600%" }
];

type Props = {
  tool: ToolState["currentTool"];
  colorIndex: ToolState["selectedColorIndex"];
  paletteIndex: ToolState["selectedPaletteIndex"];
  paletteCollection: GamePaletteCollectionWithColors;
  currentPalette: GamePaletteWithColors;
  scale: RenderCanvasPositioning["scale"];
  dispatch: React.Dispatch<ToolAction>;
  onReset: () => void;
  onSetScale: (scale: RenderCanvasPositioning["scale"]) => void;
};

const NametableToolbar = ({
  tool,
  colorIndex,
  paletteIndex,
  paletteCollection,
  currentPalette,
  scale,
  dispatch,
  onReset,
  onSetScale
}: Props) => {
  const scaleId = useId();
  return (
    <Toolbar.Container>
      <PencilSelectionToolbar
        colorIndex={tool === "pencil" ? colorIndex : null}
        currentPalette={currentPalette}
        onPencilSelected={colorIndex =>
          dispatch({
            type: ToolActionTypes.PENCIL_SELECTED,
            payload: { colorIndex }
          })
        }
      />
      <PaletteSelectionToolbar
        paletteIndex={tool === "palette" ? paletteIndex : null}
        paletteCollection={paletteCollection}
        onPaletteSelected={paletteIndex =>
          dispatch({
            type: ToolActionTypes.PALETTE_SELECTED,
            payload: { paletteIndex }
          })
        }
      />
      <Toolbar>
        <Button
          aria-label="Select pattern tile"
          icon={FiSquare}
          appearance={tool === "pattern" ? "dark" : "default"}
          onClick={() =>
            dispatch({
              type: ToolActionTypes.TOOL_SELECTED,
              payload: "pattern"
            })
          }
        />
      </Toolbar>
      <Toolbar>
        <RovingTabIndexProvider>
          <Button.WithRovingTabIndex
            aria-label="move visible canvas"
            icon={FiMove}
            appearance={tool === "move" ? "dark" : "default"}
            onClick={() =>
              dispatch({
                type: ToolActionTypes.TOOL_SELECTED,
                payload: "move"
              })
            }
          />
          <Button.WithRovingTabIndex
            aria-label="Zoom into canvas"
            icon={FiZoomIn}
            appearance={tool === "zoomIn" ? "dark" : "default"}
            onClick={() =>
              dispatch({
                type: ToolActionTypes.TOOL_SELECTED,
                payload: "zoomIn"
              })
            }
          />
          <Button.WithRovingTabIndex
            aria-label="Zoom out of canvas"
            icon={FiZoomOut}
            appearance={tool === "zoomOut" ? "dark" : "default"}
            onClick={() =>
              dispatch({
                type: ToolActionTypes.TOOL_SELECTED,
                payload: "zoomOut"
              })
            }
          />
        </RovingTabIndexProvider>
      </Toolbar>
      <Toolbar>
        <SelectInput
          id={scaleId}
          options={SCALE_OPTIONS}
          value={scale}
          onChange={onSetScale}
        />
      </Toolbar>
      <Toolbar>
        <Button aria-label="Reset canvas view" onClick={onReset}>
          Reset zoom
        </Button>
      </Toolbar>
    </Toolbar.Container>
  );
};

export default NametableToolbar;
