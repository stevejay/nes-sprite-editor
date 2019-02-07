import React from "react";
import { clamp } from "lodash";
import Draggable, {
  DraggableEventHandler,
  DraggableBounds
} from "react-draggable";
import styles from "./NametableCanvasInteractionTracker.module.scss";
import classNames from "classnames";
import {
  CanvasViewport,
  Tool,
  RenderAction,
  RenderActionTypes,
  ToolState
} from "./Nametable";
import {
  ViewportSize,
  RenderCanvasPositioning,
  ViewportCoord,
  convertViewportCoordToNameablePixel
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
  // onSelect: (row: number, column: number, pressed: boolean) => void;
};

// TODO this shouldnt take children
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

          const viewportCoord: ViewportCoord = {
            x: xInContainer,
            y: yInContainer
          };

          const flattenedLogicalCoord = convertViewportCoordToNameablePixel(
            renderCanvasPositioning,
            viewportCoord
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
      // viewportScaling: 1,
      // topTile: 0,
      // leftTile: 0
      // const boundingRect = containerRef!.current!.getBoundingClientRect();
      // const yInContainer = event.clientY - boundingRect.top;
      // const heightOfContainer = boundingRect.bottom - boundingRect.top;
      // const heightOfCell = heightOfContainer / rows;
      // const xInContainer = event.clientX - boundingRect.left;
      // const widthOfContainer = boundingRect.right - boundingRect.left;
      // const widthOfCell = widthOfContainer / columns;
      // const newRow = clamp(
      //   Math.floor(yInContainer / heightOfCell),
      //   0,
      //   rows - 1
      // );
      // const newColumn = clamp(
      //   Math.floor(xInContainer / widthOfCell),
      //   0,
      //   columns - 1
      // );
      // onSelect(newRow, newColumn, true);
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

  // const handleKeyDown = React.useCallback(
  //   (event: React.KeyboardEvent<HTMLDivElement>) => {
  //     if (event.keyCode === ENTER) {
  //       onSelect(row, column, true);
  //       return;
  //     }

  //     let newRow = row;
  //     let newColumn = column;

  //     // TODO check shift key not pressed

  //     if (event.keyCode === ARROW_UP) {
  //       event.preventDefault();
  //       newRow = newRow - 1;
  //     } else if (event.keyCode === ARROW_DOWN) {
  //       event.preventDefault();
  //       newRow = newRow + 1;
  //     } else if (event.keyCode === ARROW_LEFT) {
  //       event.preventDefault();
  //       newColumn = newColumn - 1;
  //     } else if (event.keyCode === ARROW_RIGHT) {
  //       event.preventDefault();
  //       newColumn = newColumn + 1;
  //     }

  //     newRow = clamp(newRow, 0, rows - 1);
  //     newColumn = clamp(newColumn, 0, columns - 1);
  //     onSelect(newRow, newColumn, false);
  //   },
  //   [rows, columns, row, column]
  // );

  // const dragBounds = React.useMemo(() => calculateDragBounds(renderCanvasPositioning), [
  //   renderCanvasPositioning
  // ]);

  const handleDraggableStop: DraggableEventHandler = (_event, data) => {
    // const move = { row: 0, column: 0 };
    // if (data.x > MOVE_BOUNDS_TRIGGER_DELTA) {
    //   move.column = -1;
    // } else if (data.x < -MOVE_BOUNDS_TRIGGER_DELTA) {
    //   move.column = 1;
    // }
    // if (data.y > MOVE_BOUNDS_TRIGGER_DELTA) {
    //   move.row = -1;
    // } else if (data.y < -MOVE_BOUNDS_TRIGGER_DELTA) {
    //   move.row = 1;
    // }

    renderDispatch({
      type: RenderActionTypes.MOVE,
      payload: { x: -data.x, y: -data.y }
    });
  };

  const handleMouseDown = React.useCallback(event => {
    // document.body.classList.add("no-user-select");
  }, []);

  const handleMouseUp = React.useCallback(event => {
    // document.body.classList.remove("no-user-select");
  }, []);

  const containerClassNames = classNames(styles.container, styles[currentTool]);

  return (
    <div
      ref={containerRef}
      className={containerClassNames}
      style={viewportSize}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
    </div>
  );
};

export default NametableCanvasInteractionTracker;
