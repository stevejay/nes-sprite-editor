import React from "react";
import styles from "./Highlight.module.scss";
import classNames from "classnames";

type Props = {
  children?: React.ReactNode;
  tileWidth: number;
  tileHeight: number;
  row: number;
  column: number;
  ["aria-label"]: string;
  focusOnly?: boolean;
};

const Highlight = ({
  children,
  tileWidth,
  tileHeight,
  row,
  column,
  focusOnly = false,
  ...rest
}: Props) => {
  const tileRef = React.useRef<HTMLDivElement>(null);

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

  const className = classNames(styles.container, {
    [styles.focusOnly]: focusOnly
  });

  return (
    <div
      {...rest}
      ref={tileRef}
      className={className}
      tabIndex={0}
      style={style}
      onClick={event => event.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default Highlight;
