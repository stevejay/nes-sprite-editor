import React from "react";
import { clamp } from "lodash";
import Draggable, { DraggableEventHandler } from "react-draggable";
import styles from "./NametableCanvasInteractionTracker.module.scss";
import classNames from "classnames";
import { CanvasViewport, Tool } from "./Nametable";

const ENTER = 13;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;
const MOVE_BOUNDS_DELTA = 100;
const MOVE_BOUNDS_TRIGGER_DELTA = 20;
const DRAG_POSITION = { x: 0, y: 0 };

// function calculateCanvasViewportInclusiveTiles (canvasViewport: CanvasViewport) {
//   return {
//     left:
//     top:
//     width:
//     height:
//   }
// }

function calculateDragBounds(canvasViewport: CanvasViewport) {
  const result = {
    left: -MOVE_BOUNDS_DELTA,
    top: -MOVE_BOUNDS_DELTA,
    right: MOVE_BOUNDS_DELTA,
    bottom: MOVE_BOUNDS_DELTA
  };

  const columns = 32;
  const rows = canvasViewport.scaling === 1 ? 30 : 32;

  if (canvasViewport.leftTile === 0) {
    result.right = 0;
  }

  if (canvasViewport.topTile === 0) {
    result.bottom = 0;
  }

  if (canvasViewport.leftTile + columns / canvasViewport.scaling >= columns) {
    result.left = 0;
  }

  if (canvasViewport.topTile + rows / canvasViewport.scaling >= rows) {
    result.top = 0;
  }

  // console.log("drag bounds", result);

  return result;
}

type Props = {
  pixelScaling: number;
  canvasViewport: CanvasViewport;
  children: React.ReactNode;
  toolType: Tool;
  // onSelect: (row: number, column: number, pressed: boolean) => void;
};

// TODO this shouldnt take children
const NametableCanvasInteractionTracker = ({
  pixelScaling,
  canvasViewport,
  toolType,
  // row,
  // column,
  children
}: // onSelect
Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
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
    [pixelScaling]
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

  const className = classNames(styles.container, styles[toolType]);

  const dragBounds = React.useMemo(() => calculateDragBounds(canvasViewport), [
    canvasViewport
  ]);

  const handleDraggableStop: DraggableEventHandler = (_event, data) => {
    const move = { row: 0, column: 0 };
    if (data.x > MOVE_BOUNDS_TRIGGER_DELTA) {
      move.column = -1;
    } else if (data.x < -MOVE_BOUNDS_TRIGGER_DELTA) {
      move.column = 1;
    }
    if (data.y > MOVE_BOUNDS_TRIGGER_DELTA) {
      move.row = -1;
    } else if (data.y < -MOVE_BOUNDS_TRIGGER_DELTA) {
      move.row = 1;
    }

    // if (move.row !== 0 || move.column !== 0) {
    //   console.log("move", move);
    // }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseDown={handleMouseDown}
      onKeyDown={undefined}
    >
      <Draggable
        position={DRAG_POSITION}
        bounds={dragBounds}
        disabled={toolType !== "move"}
        onStop={handleDraggableStop}
      >
        {children}
      </Draggable>
    </div>
  );
};

export default NametableCanvasInteractionTracker;
