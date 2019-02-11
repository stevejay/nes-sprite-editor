import React from "react";
import classNames from "classnames";
import { Color } from "../store";
import formatByteAsHex from "../../../shared/utils/format-byte-as-hex";
import styles from "./PaletteColor.module.scss";

type Props = {
  color: Color;
  isTransparent?: boolean;
  screenReaderLabel?: string;
};

const PaletteColor: React.FunctionComponent<Props> = ({
  color,
  isTransparent = false,
  screenReaderLabel
}) => {
  const containerStyle =
    color.available && !isTransparent
      ? { backgroundColor: color.rgb }
      : undefined;

  const containerClassName = classNames(styles.container, {
    [styles.notAvailable]: !color.available,
    [styles.isTransparency]: isTransparent
  });

  return (
    <div className={containerClassName} style={containerStyle}>
      {!isTransparent && (
        <span className={styles.label}>{formatByteAsHex(color.id)}</span>
      )}
      <span className="screen-reader-only">{screenReaderLabel || name}</span>
    </div>
  );
};

export default PaletteColor;
