import React from "react";
import styles from "./GridInteractionTracker.module.scss";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;

export type Props = {
  children: React.ReactNode;
  rows: number;
  columns: number;
  onChange: (
    type: "absolute" | "delta",
    value: { row: number; column: number }
  ) => void;
};

const GridInteractionTracker: React.FunctionComponent<Props> = ({
  children,
  rows,
  columns,
  onChange
}) => {
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

      onChange("absolute", {
        row: Math.floor(yInContainer / heightOfCell),
        column: Math.floor(xInContainer / widthOfCell)
      });
    },
    [rows, columns, onChange]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === ARROW_UP) {
        event.preventDefault();
        onChange("delta", { row: -1, column: 0 });
      } else if (event.keyCode === ARROW_DOWN) {
        event.preventDefault();
        onChange("delta", { row: 1, column: 0 });
      } else if (event.keyCode === ARROW_LEFT) {
        event.preventDefault();
        onChange("delta", { row: 0, column: -1 });
      } else if (event.keyCode === ARROW_RIGHT) {
        event.preventDefault();
        onChange("delta", { row: 0, column: 1 });
      }
    },
    [onChange]
  );

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

export default GridInteractionTracker;
