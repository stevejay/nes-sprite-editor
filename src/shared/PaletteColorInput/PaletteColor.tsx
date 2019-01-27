import React from "react";
import classNames from "classnames";
import { Color } from "../../types";
import formatByteAsHex from "../utils/format-byte-as-hex";
import styles from "./PaletteColor.module.scss";

type Props = {
  color: Color;
  screenReaderLabel?: string;
};

const PaletteColor: React.FunctionComponent<Props> = ({
  color,
  screenReaderLabel
}) => {
  const containerStyle = color.available
    ? { backgroundColor: color.rgb }
    : undefined;

  const containerClassName = classNames(styles.container, {
    [styles.notAvailable]: !color.available
  });

  return (
    <div className={containerClassName} style={containerStyle}>
      <span className={styles.label}>{formatByteAsHex(color.id)}</span>
      <span className="screen-reader-only">{screenReaderLabel || name}</span>
    </div>
  );
};

export default PaletteColor;
