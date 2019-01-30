import React from "react";
import { useRovingTabIndex } from "../../shared/RovingTabIndex";
import { Color, SystemPalette } from "../../types";
import PaletteColorInput from "../../shared/PaletteColorInput";

type Props = {
  index: number;
  systemPalette: SystemPalette;
  color: Color;
  onChange: (color: Color) => void;
};

const PaletteToolbarColorInput = ({
  index,
  color,
  systemPalette,
  onChange
}: Props) => {
  const [tabIndex, onKeyDown, onClick, focused] = useRovingTabIndex(index);
  return (
    <PaletteColorInput
      color={color}
      tabIndex={tabIndex}
      focused={focused}
      systemPalette={systemPalette}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onChange={onChange}
    />
  );
};

export default PaletteToolbarColorInput;
