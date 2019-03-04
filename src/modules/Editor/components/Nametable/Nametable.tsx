import { isNil } from "lodash";
import React from "react";
import TileCanvas from "../../../../shared/TileCanvas";
import DraggableNametableCanvas from "./DraggableNametableCanvas";
import styles from "./Nametable.module.scss";
import NametableToolbar from "./NametableToolbar";
import {
  GamePaletteCollectionWithColors,
  Nametable as NametableType,
  PatternTable
} from "../../store";
import { useToolReducer } from "./tool-reducer";
import {
  ActionTypes as ViewportActionTypes,
  useViewportReducer,
  VIEWPORT_SIZE
} from "./viewport-reducer";
import ZoomInTool from "./ZoomInTool";
import ZoomOutTool from "./ZoomOutTool";
import PaletteTool from "./PaletteTool";
import PencilTool from "./PencilTool";
import PatternTool from "./PatternTool";

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  tileIndex: number;
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
  tileIndex,
  onChangePatternTable,
  onChangePalette,
  onChangeTile
}: Props) => {
  const [viewportState, viewportDispatch] = useViewportReducer();
  const [toolState, toolDispatch] = useToolReducer();

  if (!nametable || !patternTable || !paletteCollection) {
    return null;
  }

  const currentPalette = !isNil(toolState.currentTile.metatileIndex)
    ? paletteCollection.gamePalettes[
        nametable.paletteIndexes[toolState.currentTile.metatileIndex]
      ]
    : paletteCollection.gamePalettes[toolState.selectedPaletteIndex];

  const isLocked =
    patternTable &&
    nametable &&
    viewportState.scale >= 2 &&
    !isNil(toolState.currentTile.tileIndex) &&
    patternTable.tiles[nametable.tileIndexes[toolState.currentTile.tileIndex]]
      .isLocked;

  return (
    <>
      <NametableToolbar
        dispatch={toolDispatch}
        tool={toolState.currentTool}
        colorIndex={toolState.selectedColorIndex}
        paletteIndex={toolState.selectedPaletteIndex}
        paletteCollection={paletteCollection}
        patternTable={patternTable}
        currentPalette={currentPalette}
        scale={viewportState.scale}
        tileIndex={tileIndex}
        onReset={() =>
          viewportDispatch({
            type: ViewportActionTypes.INITIALIZE
          })
        }
        onSetScale={scale =>
          viewportDispatch({
            type: ViewportActionTypes.CHANGE_SCALE,
            payload: scale
          })
        }
      />
      <TileCanvas.Container>
        <div className={styles.background} style={VIEWPORT_SIZE}>
          <DraggableNametableCanvas
            viewportSize={VIEWPORT_SIZE}
            viewportState={viewportState}
            patternTable={patternTable}
            currentTool={toolState.currentTool}
            nametable={nametable}
            gamePalettes={paletteCollection.gamePalettes}
            viewportDispatch={viewportDispatch}
          />
          {toolState.currentTool === "zoomIn" && (
            <ZoomInTool
              viewportSize={VIEWPORT_SIZE}
              viewportDispatch={viewportDispatch}
            />
          )}
          {toolState.currentTool === "zoomOut" && (
            <ZoomOutTool
              viewportSize={VIEWPORT_SIZE}
              viewportDispatch={viewportDispatch}
            />
          )}
          {toolState.currentTool === "palette" && (
            <PaletteTool
              viewportSize={VIEWPORT_SIZE}
              viewportState={viewportState}
              toolDispatch={toolDispatch}
              isLocked={isLocked}
              currentTile={toolState.currentTile}
              selectedPaletteIndex={toolState.selectedPaletteIndex}
              nametable={nametable}
              onChange={onChangePalette}
            />
          )}
          {toolState.currentTool === "pencil" && (
            <PencilTool
              viewportSize={VIEWPORT_SIZE}
              viewportState={viewportState}
              toolDispatch={toolDispatch}
              isLocked={isLocked}
              currentTile={toolState.currentTile}
              selectedColorIndex={toolState.selectedColorIndex}
              nametable={nametable}
              patternTable={patternTable}
              onChange={onChangePatternTable}
            />
          )}
          {toolState.currentTool === "pattern" && (
            <PatternTool
              viewportSize={VIEWPORT_SIZE}
              viewportState={viewportState}
              toolDispatch={toolDispatch}
              isLocked={isLocked}
              currentTile={toolState.currentTile}
              selectedColorIndex={toolState.selectedColorIndex}
              nametable={nametable}
              tileIndex={tileIndex}
              onChange={onChangeTile}
            />
          )}
        </div>
      </TileCanvas.Container>
    </>
  );
};

export default Nametable;
