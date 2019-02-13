import React, { CSSProperties } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import styles from "./NametableCanvasInteractionTracker.module.scss";
import classNames from "classnames";
import {
  RenderAction,
  RenderActionTypes,
  ToolState,
  ToolAction,
  ToolActionTypes
} from "./Nametable";
import {
  ViewportSize,
  RenderCanvasPositioning,
  convertViewportCoordToNameablePixel,
  convertViewportCoordToNametableMetatile,
  convertTilePositionToCanvasCoords
} from "./experiment";
import { PatternTable, Nametable, GamePaletteWithColors } from "./store";
import { isNil } from "lodash";
import useOpenDialog from "../../shared/utils/use-open-dialog";
import { PatternTableModal } from "./PatternTable";

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

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
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
    },
    [renderCanvasPositioning, currentTile, currentTool]
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
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
    },
    [
      currentTool,
      selectedColorIndex,
      selectedPaletteIndex,
      viewportSize,
      patternTable,
      nametable,
      renderCanvasPositioning,
      currentTile
    ]
  );

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
      if (isNil(nametable) || isNil(currentTile.tileIndex)) {
        return;
      }
      console.log("change", nametable.id, currentTile.tileIndex, value);
      onChangeTile(nametable.id, currentTile.tileIndex, value);
    },
    [onChangeTile, nametable, currentTile]
  );

  return (
    <>
      <div
        ref={containerRef}
        className={containerClassNames}
        style={viewportSize}
        onMouseMove={isHighlightTool ? handleMouseMove : undefined}
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
            className={styles.metatileContainer}
            style={highlightBoxStyle}
            onClick={currentTool === "pattern" ? handleOpen : undefined}
          />
        )}
      </div>
      <PatternTableModal
        isOpen={isOpen}
        patternTable={patternTable}
        palette={currentPalette}
        selectedTileIndex={nametable!.tileIndexes[currentTile.tileIndex!]}
        originElement={highlightBoxRef.current}
        onSelectTile={handleSelectTile}
        onClose={handleClose}
      />
    </>
  );
};

export default NametableCanvasInteractionTracker;
