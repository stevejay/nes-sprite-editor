import React from "react";
import styles from "./ColorPicker.module.scss";
import PaletteColor from "./PaletteColor";
import { Color, ColorId, SystemPalette } from "../../types";

type Props = {
  palette: SystemPalette;
  selectedColorId: ColorId;
  onChange: (color: Color) => void;
};

// const NewColorPicker: React.FunctionComponent<Props> = ({
//   palette,
//   selectedColorId,
//   onChange
// }) => {
//   return (
//     <canvas className={styles.container}>

//     </canvas>
//   )
// };

const ColorPicker: React.FunctionComponent<Props> = ({
  palette,
  selectedColorId,
  onChange
}) => (
  <div className={styles.container}>
    {palette.values.map(color => {
      const id = `palette_color_${color.id}`;
      const checked = selectedColorId === color.id;
      return (
        <label key={color.id} htmlFor={id} className={styles.label}>
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
            screenReaderLabel={`Color ${color.id}`}
            compact
          />
        </label>
      );
    })}
  </div>
);

export default ColorPicker;
