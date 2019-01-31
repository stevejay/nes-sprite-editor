import React from "react";
import styles from "./SelectedTile.module.scss";

type Props = {
  children?: React.ReactNode;
  tileWidth: number;
  tileHeight: number;
  row: number;
  column: number;
  ariaLabel: string;
  focusOnly?: boolean;
};

const SelectedTile = ({
  children,
  tileWidth,
  tileHeight,
  row,
  column,
  ariaLabel,
  focusOnly = false
}: Props) => {
  const tileRef = React.useRef<HTMLDivElement | null>(null);

  const style = React.useMemo(
    () => ({
      left: tileWidth * 0.5,
      top: tileHeight * 0.5,
      transform: `translate(calc(-50% + ${column *
        tileWidth}px), calc(-50% + ${row * tileHeight}px))`,
      width: `${tileWidth}px`,
      height: `${tileHeight}px`
    }),
    [tileWidth, tileHeight, row, column]
  );

  return (
    <div
      ref={tileRef}
      className={`${styles.container} ${focusOnly ? styles.focusOnly : ""}`}
      tabIndex={0}
      style={style}
      onClick={event => event.stopPropagation()}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

export default SelectedTile;
