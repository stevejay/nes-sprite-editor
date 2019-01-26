import React from "react";
import styles from "./SelectedTile.module.scss";

type Props = {
  children?: React.ReactNode;
  tileWidth: number;
  tileHeight: number;
  row: number;
  column: number;
  ariaLabel: string;
};

const SelectedTile: React.FunctionComponent<Props> = ({
  children,
  tileWidth,
  tileHeight,
  row,
  column,
  ariaLabel
}) => {
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

  console.log("style", column * tileWidth);

  return (
    <div
      ref={tileRef}
      className={styles.container}
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
