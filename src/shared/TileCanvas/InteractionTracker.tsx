import React from "react";
import { clamp } from "lodash";
import styles from "./InteractionTracker.module.scss";

type Props = {
  rows: number;
  columns: number;
  row: number;
  column: number;
  children: React.ReactNode;
  onSelect: (row: number, column: number, pressed: boolean) => void;
};

const InteractionTracker = ({
  rows,
  columns,
  row,
  column,
  children,
  onSelect
}: Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = containerRef!.current!.getBoundingClientRect();

    const yInContainer = event.clientY - boundingRect.top;
    const heightOfContainer = boundingRect.bottom - boundingRect.top;
    const heightOfCell = heightOfContainer / rows;

    const xInContainer = event.clientX - boundingRect.left;
    const widthOfContainer = boundingRect.right - boundingRect.left;
    const widthOfCell = widthOfContainer / columns;

    const newRow = clamp(Math.floor(yInContainer / heightOfCell), 0, rows - 1);

    const newColumn = clamp(
      Math.floor(xInContainer / widthOfCell),
      0,
      columns - 1
    );

    onSelect(newRow, newColumn, true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onSelect(row, column, true);
      return;
    }

    let newRow = row;
    let newColumn = column;

    // TODO check shift key not pressed

    if (event.key === "ArrowUp") {
      event.preventDefault();
      newRow = newRow - 1;
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      newRow = newRow + 1;
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      newColumn = newColumn - 1;
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      newColumn = newColumn + 1;
    }

    newRow = clamp(newRow, 0, rows - 1);
    newColumn = clamp(newColumn, 0, columns - 1);
    onSelect(newRow, newColumn, false);
  };

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

export default InteractionTracker;
