import React from "react";
import classNames from "classnames";
import { FaRegEyeSlash } from "react-icons/fa";
import { Color } from "./types";
import formatRgb from "./format-rgb";
import formatHex from "./format-hex";
import styles from "./PaletteColor.module.scss";

type Props = {
  color: Color;
  srLabel?: string;
  selected?: boolean;
  compact?: boolean;
};

const PaletteColor: React.FunctionComponent<Props> = React.memo(
  ({ color, srLabel, selected = false, compact = false }) => {
    const containerStyle = color.available
      ? { backgroundColor: formatRgb(color.rgb) }
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
          <span className={styles.label}>{formatHex(color.id)}</span>
        )}
        <span className="screenreader-only">{srLabel || name}</span>
      </div>
    );
  }
);

export default PaletteColor;
