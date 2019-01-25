import React from "react";
import classNames from "classnames";
import { FaRegEyeSlash } from "react-icons/fa";
import { Color } from "../../types";
import formatByteAsHex from "../utils/format-byte-as-hex";
import styles from "./PaletteColor.module.scss";

type Props = {
  color: Color;
  screenReaderLabel?: string;
  selected?: boolean;
  compact?: boolean;
};

const PaletteColor: React.FunctionComponent<Props> = ({
  color,
  screenReaderLabel,
  selected = false,
  compact = false
}) => {
  const containerStyle = color.available
    ? { backgroundColor: color.rgb }
    : undefined;

  const containerClassName = classNames(styles.container, {
    [styles.notAvailable]: !color.available,
    [styles.selected]: selected,
    [styles.compact]: compact
  });

  return (
    <div className={containerClassName} style={containerStyle}>
      {!color.available && <FaRegEyeSlash />}
      {!compact && (
        <span className={styles.label}>{formatByteAsHex(color.id)}</span>
      )}
      <span className="screen-reader-only">{screenReaderLabel || name}</span>
    </div>
  );
};

export default PaletteColor;
