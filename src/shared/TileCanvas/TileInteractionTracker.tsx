import React from "react";
import { clamp } from "lodash";
import styles from "./TileInteractionTracker.module.scss";

const ENTER = 13;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;

type Props = {
  rows: number;
  columns: number;
  row: number;
  column: number;
  children: React.ReactNode;
  onSelect: (row: number, column: number, pressed: boolean) => void;
};

const TileInteractionTracker = ({
  rows,
  columns,
  row,
  column,
  children,
  onSelect
}: Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleContainerClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const boundingRect = containerRef!.current!.getBoundingClientRect();

      const yInContainer = event.clientY - boundingRect.top;
      const heightOfContainer = boundingRect.bottom - boundingRect.top;
      const heightOfCell = heightOfContainer / rows;

      const xInContainer = event.clientX - boundingRect.left;
      const widthOfContainer = boundingRect.right - boundingRect.left;
      const widthOfCell = widthOfContainer / columns;

      const newRow = clamp(
        Math.floor(yInContainer / heightOfCell),
        0,
        rows - 1
      );

      const newColumn = clamp(
        Math.floor(xInContainer / widthOfCell),
        0,
        columns - 1
      );

      onSelect(newRow, newColumn, true);
    },
    [rows, columns, row, column, onSelect]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === ENTER) {
        onSelect(row, column, true);
        return;
      }

      let newRow = row;
      let newColumn = column;

      // TODO check shift key not pressed

      if (event.keyCode === ARROW_UP) {
        event.preventDefault();
        newRow = newRow - 1;
      } else if (event.keyCode === ARROW_DOWN) {
        event.preventDefault();
        newRow = newRow + 1;
      } else if (event.keyCode === ARROW_LEFT) {
        event.preventDefault();
        newColumn = newColumn - 1;
      } else if (event.keyCode === ARROW_RIGHT) {
        event.preventDefault();
        newColumn = newColumn + 1;
      }

      newRow = clamp(newRow, 0, rows - 1);
      newColumn = clamp(newColumn, 0, columns - 1);
      onSelect(newRow, newColumn, false);
    },
    [rows, columns, row, column]
  );

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseDown={handleContainerClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

export default TileInteractionTracker;
