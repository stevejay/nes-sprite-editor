import React from "react";
import styles from "./NametableToolbar.module.scss";
import { RovingTabIndexProvider } from "../../shared/RovingTabIndex";
import Button from "../../shared/Button";
import { ToolAction, ToolActionTypes, ToolState } from "./Nametable";
import { range } from "lodash";
import {
  FiEdit2,
  FiGrid,
  FiZoomIn,
  FiZoomOut,
  FiMove,
  FiSquare
} from "react-icons/fi";
import SelectInput from "../../shared/SelectInput";
import useId from "../../shared/utils/use-id";
import { RenderCanvasPositioning } from "./experiment";
import { GamePaletteWithColors } from "./store";

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
  currentPalette: GamePaletteWithColors;
  scale: RenderCanvasPositioning["scale"];
  toolDispatch: React.Dispatch<ToolAction>;
  onReset: () => void;
  onSetScale: (scale: RenderCanvasPositioning["scale"]) => void;
};

const NametableToolbar = ({
  tool,
  colorIndex,
  paletteIndex,
  currentPalette,
  scale,
  toolDispatch,
  onReset,
  onSetScale
}: Props) => {
  const scaleId = useId();
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.toolbar}>
          <RovingTabIndexProvider>
            {range(0, 4).map(index => {
              const selected = tool === "pencil" && colorIndex === index;
              const color = currentPalette.colors[index];
              return (
                <Button.WithRovingTabIndex
                  key={index}
                  aria-label={`Pencil tool for color #${index}`}
                  icon={FiEdit2}
                  appearance={selected ? "dark" : "default"}
                  onClick={() =>
                    toolDispatch({
                      type: ToolActionTypes.PENCIL_SELECTED,
                      payload: { colorIndex: index }
                    })
                  }
                  className={styles.buttonWithSwatch}
                >
                  <span
                    className={styles.swatch}
                    style={{
                      backgroundColor: color.available ? color.rgb : "#FFF"
                    }}
                  />
                </Button.WithRovingTabIndex>
              );
            })}
            {range(0, 4).map(index => {
              const selected = tool === "palette" && paletteIndex === index;
              return (
                <Button.WithRovingTabIndex
                  key={index}
                  aria-label={`Palette tool for background palette #${index}`}
                  icon={FiGrid}
                  appearance={selected ? "dark" : "default"}
                  onClick={() =>
                    toolDispatch({
                      type: ToolActionTypes.PALETTE_SELECTED,
                      payload: { paletteIndex: index }
                    })
                  }
                >
                  {index}
                </Button.WithRovingTabIndex>
              );
            })}
            <Button.WithRovingTabIndex
              aria-label="Select pattern tile"
              icon={FiSquare}
              appearance={tool === "pattern" ? "dark" : "default"}
              onClick={() =>
                toolDispatch({
                  type: ToolActionTypes.TOOL_SELECTED,
                  payload: "pattern"
                })
              }
            />
          </RovingTabIndexProvider>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.toolbar}>
          <RovingTabIndexProvider>
            <Button.WithRovingTabIndex
              aria-label="move visible canvas"
              icon={FiMove}
              appearance={tool === "move" ? "dark" : "default"}
              onClick={() =>
                toolDispatch({
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
                toolDispatch({
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
                toolDispatch({
                  type: ToolActionTypes.TOOL_SELECTED,
                  payload: "zoomOut"
                })
              }
            />
          </RovingTabIndexProvider>
        </div>
        <div className={styles.toolbar}>
          <SelectInput<RenderCanvasPositioning["scale"]>
            id={scaleId}
            options={SCALE_OPTIONS}
            value={scale}
            onChange={onSetScale}
          />
        </div>
        <div className={styles.toolbar}>
          <Button aria-label="Reset canvas view" onClick={onReset}>
            Reset zoom
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NametableToolbar;
