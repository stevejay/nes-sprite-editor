import classNames from "classnames";
import { isNil } from "lodash";
import React, { CSSProperties } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { FiLock } from "react-icons/fi";
import useOpenDialog from "../../shared/utils/use-open-dialog";
import {
  convertTilePositionToCanvasCoords,
  convertViewportCoordToNameablePixel,
  convertViewportCoordToNametableMetatile,
  RenderCanvasPositioning,
  ViewportSize
} from "./experiment";
import {
  RenderAction,
  RenderActionTypes,
  ToolAction,
  ToolActionTypes,
  ToolState
} from "./Nametable";
import styles from "./NametableCanvasInteractionTracker.module.scss";
import { PatternTableModal } from "./PatternTable";
import { GamePaletteWithColors, Nametable, PatternTable } from "./store";

const DRAG_POSITION = { x: 0, y: 0 };

type Props = {
  viewportSize: ViewportSize;
  nametable: Nametable | null;
  patternTable: PatternTable | null;
  renderCanvasPositioning: RenderCanvasPositioning;
  currentTool: ToolState["currentTool"];
  currentPalette: GamePaletteWithColors;
  selectedColorIndex: ToolState["selectedColorIndex"];
  selectedPaletteIndex: ToolState["selectedPaletteIndex"];
  currentTile: ToolState["currentTile"];
  scale: number;
  renderDispatch: React.Dispatch<RenderAction>;
  toolDispatch: React.Dispatch<ToolAction>;
  children: React.ReactNode;
  onChangePatternTable: (
    id: string,
    tileIndex: number,
    startPixelIndex: number,
    newPixels: Array<number>
  ) => void;
  onChangePalette: (id: string, paletteIndex: number, newIndex: number) => void;
  onChangeTile: (id: string, tileIndex: number, newValue: number) => void;
};

const NametableCanvasInteractionTracker = ({
  viewportSize,
  nametable,
  patternTable,
  renderCanvasPositioning,
  currentTool,
  currentPalette,
  selectedColorIndex,
  selectedPaletteIndex,
  currentTile,
  scale,
  renderDispatch,
  toolDispatch,
  children,
  onChangePatternTable,
  onChangePalette,
  onChangeTile
}: Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const highlightBoxRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, handleOpen, handleClose] = useOpenDialog();
  const [patternTileIndex, setPatternTileIndex] = React.useState(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = containerRef!.current!.getBoundingClientRect();
    const yInContainer = event.clientY - boundingRect.top;
    const xInContainer = event.clientX - boundingRect.left;

    const tilePosition = convertViewportCoordToNametableMetatile(
      renderCanvasPositioning,
      { x: xInContainer, y: yInContainer }
    );

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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = containerRef!.current!.getBoundingClientRect();
    const yInContainer = event.clientY - boundingRect.top;
    const xInContainer = event.clientX - boundingRect.left;

    if (
      xInContainer < 0 ||
      xInContainer > viewportSize.width ||
      yInContainer < 0 ||
      yInContainer > viewportSize.height
    ) {
      return;
    }

    switch (currentTool) {
      case "zoomIn":
        renderDispatch({
          type: RenderActionTypes.ZOOM_IN,
          payload: { x: xInContainer, y: yInContainer }
        });
        break;
      case "zoomOut":
        renderDispatch({
          type: RenderActionTypes.ZOOM_OUT,
          payload: { x: xInContainer, y: yInContainer }
        });
        break;
      case "pencil": {
        if (!patternTable || !nametable) {
          break;
        }

        const flattenedLogicalCoord = convertViewportCoordToNameablePixel(
          renderCanvasPositioning,
          { x: xInContainer, y: yInContainer }
        );

        if (!flattenedLogicalCoord) {
          break;
        }

        onChangePatternTable(
          patternTable.id,
          nametable.tileIndexes[flattenedLogicalCoord.tileIndex],
          flattenedLogicalCoord.tilePixelIndex,
          [selectedColorIndex]
        );
        break;
      }
      case "palette": {
        if (isNil(currentTile.metatileIndex) || isNil(nametable)) {
          break;
        }
        onChangePalette(
          nametable.id,
          currentTile.metatileIndex,
          selectedPaletteIndex
        );
        break;
      }
      case "pattern": {
        if (!patternTable) {
          break;
        }

        break;
      }
    }
  };

  const handleDraggableStop: DraggableEventHandler = (_event, data) => {
    renderDispatch({
      type: RenderActionTypes.MOVE,
      payload: { x: -data.x, y: -data.y }
    });
  };

  const containerClassNames = classNames(styles.container, styles[currentTool]);

  const highlightBoxStyle = React.useMemo<CSSProperties | null>(() => {
    const highlightArea = isNil(currentTile.tileIndex)
      ? null
      : convertTilePositionToCanvasCoords(
          renderCanvasPositioning,
          currentTile,
          currentTool === "palette"
        );
    return isNil(highlightArea)
      ? null
      : {
          top: highlightArea.y,
          left: highlightArea.x,
          width: highlightArea.width,
          height: highlightArea.height
        };
  }, [renderCanvasPositioning, currentTile, currentTool]);

  const isHighlightTool =
    currentTool === "palette" ||
    currentTool === "pencil" ||
    currentTool === "pattern";

  const handleSelectTile = React.useCallback(
    (value: number) => {
      console.log("handleSelectTile", nametable, patternTileIndex, value);

      if (isNil(nametable) || isNil(patternTileIndex)) {
        return;
      }

      onChangeTile(nametable.id, patternTileIndex, value);
    },
    [onChangeTile, nametable, patternTileIndex]
  );

  const handleHighlightClick = () => {
    if (currentTile.tileIndex) {
      setPatternTileIndex(currentTile.tileIndex);
    }
    handleOpen();
  };

  return (
    <>
      <div
        ref={containerRef}
        className={containerClassNames}
        style={viewportSize}
        onMouseMove={isHighlightTool ? handleMouseMove : undefined}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={undefined}
      >
        <Draggable
          position={DRAG_POSITION}
          disabled={currentTool !== "move"}
          onStop={handleDraggableStop}
        >
          {children}
        </Draggable>
        {isHighlightTool && highlightBoxStyle && (
          <div
            ref={highlightBoxRef}
            className={styles.highlightBox}
            style={highlightBoxStyle}
            onClick={
              currentTool === "pattern" ? handleHighlightClick : undefined
            }
          >
            {patternTable &&
              nametable &&
              scale >= 2 &&
              !isNil(currentTile.tileIndex) &&
              patternTable.tiles[nametable.tileIndexes[currentTile.tileIndex]]
                .isLocked && <FiLock />}
          </div>
        )}
      </div>
      <PatternTableModal
        isOpen={isOpen}
        patternTable={patternTable}
        palette={currentPalette}
        selectedTileIndex={nametable!.tileIndexes[patternTileIndex]}
        originElement={highlightBoxRef.current}
        onSelectTile={handleSelectTile}
        onClose={handleClose}
      />
    </>
  );
};

export default NametableCanvasInteractionTracker;
