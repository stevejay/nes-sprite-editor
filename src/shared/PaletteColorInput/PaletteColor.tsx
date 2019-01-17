import React from "react";
import classNames from "classnames";
import { FaRegEyeSlash } from "react-icons/fa";
import { Color } from "../../types";
import formatRgbValueAsString from "../../shared/utils/format-rgb-value-as-string";
import formatIntegerAsHex from "../../shared/utils/format-integer-as-hex";
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
      ? { backgroundColor: formatRgbValueAsString(color.rgb) }
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
          <span className={styles.label}>{formatIntegerAsHex(color.id)}</span>
        )}
        <span className="screenreader-only">{srLabel || name}</span>
      </div>
    );
  }
);

export default PaletteColor;
