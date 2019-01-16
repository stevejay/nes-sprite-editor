import React from "react";
import { SystemPalette, Color, ColorId } from "./types";
import styles from "./PaletteInput.module.scss";
import PaletteColor from "./PaletteColor";
import classNames from "classnames";

type Props = {
  palette: SystemPalette;
  selectedColorId: ColorId; // 0 to 63 inclusive
  onChange: (color: Color) => void;
};

const PaletteInput: React.FunctionComponent<Props> = ({
  palette,
  selectedColorId,
  onChange
}) => (
  <div className={styles.radioGroup}>
    {palette.values.map(color => {
      const id = `palette_color_${color.id}`;
      const checked = selectedColorId === color.id;

      const labelClassName = classNames(styles.radioButton, {
        [styles.checked]: checked
      });

      return (
        <label key={color.id} htmlFor={id} className={labelClassName}>
          <input
            type="radio"
            value={color.id}
            checked={checked}
            disabled={!color.available}
            name="palette_color"
            id={id}
            onChange={() => onChange(color)}
          />
          <PaletteColor
            color={color}
            selected={checked}
            srLabel={`Color ${color.id}`}
            compact
          />
        </label>
      );
    })}
  </div>
);

export default PaletteInput;
