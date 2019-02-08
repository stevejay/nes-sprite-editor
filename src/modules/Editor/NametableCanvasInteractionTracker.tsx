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
  convertViewportCoordToNameableMetatile,
  convertMetatileIndexToCanvasCoords
} from "./experiment";
import { PatternTable, Nametable } from "../../types";
import { isNil } from "lodash";
import { Action } from "./redux";

const DRAG_POSITION = { x: 0, y: 0 };

type Props = {
  viewportSize: ViewportSize;
  nametable: Nametable | null;
  patternTable: PatternTable | null;
  renderCanvasPositioning: RenderCanvasPositioning;
  currentTool: ToolState["currentTool"];
  selectedColorIndex: ToolState["selectedColorIndex"];
  currentMetatileIndex: ToolState["currentMetatileIndex"];
  renderDispatch: React.Dispatch<RenderAction>;
  toolDispatch: React.Dispatch<ToolAction>;
  children: React.ReactNode;
  onChangePatternTable: (
    id: string,
    tileIndex: number,
    startPixelIndex: number,
    newPixels: Array<number>
  ) => Action;
};

const NametableCanvasInteractionTracker = ({
  viewportSize,
  nametable,
  patternTable,
  renderCanvasPositioning,
  currentTool,
  selectedColorIndex,
  currentMetatileIndex,
  renderDispatch,
  toolDispatch,
  children,
  onChangePatternTable
}: Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const boundingRect = containerRef!.current!.getBoundingClientRect();
      const yInContainer = event.clientY - boundingRect.top;
      const xInContainer = event.clientX - boundingRect.left;

      const metatileIndex = convertViewportCoordToNameableMetatile(
        renderCanvasPositioning,
        { x: xInContainer, y: yInContainer }
      );

      if (currentMetatileIndex !== metatileIndex) {
        toolDispatch({
          type: ToolActionTypes.CURRENT_METATILE_UPDATED,
          payload: metatileIndex
        });
      }
    },
    [renderCanvasPositioning, currentMetatileIndex]
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
        }
      }
    },
    [
      currentTool,
      selectedColorIndex,
      viewportSize,
      patternTable,
      nametable,
      renderCanvasPositioning
    ]
  );

  const handleDraggableStop: DraggableEventHandler = (_event, data) => {
    renderDispatch({
      type: RenderActionTypes.MOVE,
      payload: { x: -data.x, y: -data.y }
    });
  };

  // const handleMouseDown = React.useCallback(event => {
  // }, []);

  // const handleMouseUp = React.useCallback(event => {
  // }, []);

  const containerClassNames = classNames(styles.container, styles[currentTool]);

  // const metatileArea = isNil(currentMetatileIndex)
  //   ? null
  //   : convertMetatileIndexToCanvasCoords(
  //       renderCanvasPositioning,
  //       currentMetatileIndex
  //     );

  const metatileStyle = React.useMemo<CSSProperties | null>(() => {
    const metatileArea = isNil(currentMetatileIndex)
      ? null
      : convertMetatileIndexToCanvasCoords(
          renderCanvasPositioning,
          currentMetatileIndex
        );
    return isNil(metatileArea)
      ? null
      : {
          top: metatileArea.y,
          left: metatileArea.x,
          width: metatileArea.width,
          height: metatileArea.height
        };
  }, [renderCanvasPositioning, currentMetatileIndex]);

  return (
    <div
      ref={containerRef}
      className={containerClassNames}
      style={viewportSize}
      // onMouseDown={handleMouseDown}
      // onMouseOver={handleMouseOver}
      onMouseMove={currentTool === "pencil" ? handleMouseMove : undefined}
      // onMouseUp={handleMouseUp}
      onClick={handleClick}
      onKeyDown={undefined}
    >
      <Draggable
        position={DRAG_POSITION}
        // bounds={dragBounds}
        disabled={currentTool !== "move"}
        onStop={handleDraggableStop}
      >
        {children}
      </Draggable>
      {currentTool === "pencil" && metatileStyle && (
        <div className={styles.metatileContainer} style={metatileStyle} />
      )}
    </div>
  );
};

export default NametableCanvasInteractionTracker;
