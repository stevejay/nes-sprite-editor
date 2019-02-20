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
import NametableToolbar from "./NametableToolbar";
import { isNil } from "lodash";
import { useToolReducer } from "./tool-reducer";
import {
  useViewportReducer,
  ActionTypes as ViewportActionTypes,
  VIEWPORT_SIZE
} from "./viewport-reducer";

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
  const [viewportState, viewportDispatch] = useViewportReducer();
  const [toolState, toolDispatch] = useToolReducer();

  if (!nametable || !patternTable || !paletteCollection) {
    return null;
  }

  const currentPalette = !isNil(toolState.currentTile.metatileIndex)
    ? paletteCollection.gamePalettes[
        nametable.paletteIndexes[toolState.currentTile.metatileIndex]
      ]
    : // TODO should this just be gamePalettes[0]?
      paletteCollection.gamePalettes[toolState.selectedPaletteIndex];

  return (
    <>
      <NametableToolbar
        dispatch={toolDispatch}
        tool={toolState.currentTool}
        colorIndex={toolState.selectedColorIndex}
        paletteIndex={toolState.selectedPaletteIndex}
        paletteCollection={paletteCollection}
        currentPalette={currentPalette}
        scale={viewportState.scale}
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
          <NametableCanvasInteractionTracker
            viewportSize={VIEWPORT_SIZE}
            nametable={nametable}
            patternTable={patternTable}
            renderCanvasPositioning={viewportState}
            currentTool={toolState.currentTool}
            currentPalette={currentPalette}
            selectedColorIndex={toolState.selectedColorIndex}
            selectedPaletteIndex={toolState.selectedPaletteIndex}
            currentTile={toolState.currentTile}
            scale={viewportState.scale}
            viewportDispatch={viewportDispatch}
            toolDispatch={toolDispatch}
            onChangePatternTable={onChangePatternTable}
            onChangePalette={onChangePalette}
            onChangeTile={onChangeTile}
          >
            <NametableCanvas
              viewportSize={VIEWPORT_SIZE}
              renderCanvasPositioning={viewportState}
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
