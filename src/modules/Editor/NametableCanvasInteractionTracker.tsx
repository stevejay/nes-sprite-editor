import React from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import styles from "./NametableCanvasInteractionTracker.module.scss";
import classNames from "classnames";
import { RenderAction, RenderActionTypes, ToolState } from "./Nametable";
import {
  ViewportSize,
  RenderCanvasPositioning,
  convertViewportCoordToNameablePixel,
  convertViewportCoordToNameableMetatile
} from "./experiment";
import { PatternTable, Nametable } from "../../types";
import { Action, ActionTypes } from "../../contexts/editor";

const DRAG_POSITION = { x: 0, y: 0 };

type Props = {
  viewportSize: ViewportSize;
  nametable: Nametable | null;
  patternTable: PatternTable | null;
  renderCanvasPositioning: RenderCanvasPositioning;
  currentTool: ToolState["currentTool"];
  selectedColorIndex: ToolState["selectedColorIndex"];
  dispatch: React.Dispatch<Action>;
  renderDispatch: React.Dispatch<RenderAction>;
  children: React.ReactNode;
};

const NametableCanvasInteractionTracker = ({
  viewportSize,
  nametable,
  patternTable,
  renderCanvasPositioning,
  currentTool,
  selectedColorIndex,
  dispatch,
  renderDispatch,
  children
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

      console.log("mouse over", metatileIndex);
    },
    [renderCanvasPositioning]
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

          dispatch({
            type: ActionTypes.CHANGE_PATTERN_TABLE_PIXELS,
            payload: {
              type: "background",
              tableId: patternTable.id,
              tileIndex: nametable.tileIndexes[flattenedLogicalCoord.tileIndex],
              startPixelIndex: flattenedLogicalCoord.tilePixelIndex,
              newPixels: [selectedColorIndex]
            }
          });
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

  return (
    <div
      ref={containerRef}
      className={containerClassNames}
      style={viewportSize}
      // onMouseDown={handleMouseDown}
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 150,
          height: 150,
          background: "transparent",
          border: "1px dashed #fff"
        }}
      />
    </div>
  );
};

export default NametableCanvasInteractionTracker;
