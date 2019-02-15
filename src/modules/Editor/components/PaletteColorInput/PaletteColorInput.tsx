import React from "react";
import { useRovingTabIndex } from "../../../../shared/RovingTabIndex";
import useFocusEffect from "../../../../shared/utils/use-focus-effect";
import useOpenDialog from "../../../../shared/utils/use-open-dialog";
import { Color, SystemPalette } from "../../store";
import ColorPickerModal from "./ColorPickerModal";
import PaletteColor from "./PaletteColor";
import styles from "./PaletteColorInput.module.scss";

type Props = {
  color: Color;
  systemPalette: SystemPalette;
  onChange: (color: Color) => void;
};

const PaletteColorInput = ({ color, systemPalette, onChange }: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [tabIndex, focused, onKeyDown, onClick] = useRovingTabIndex(
    buttonRef,
    false
  );
  const [isOpen, handleOpen, handleClose] = useOpenDialog();
  useFocusEffect(focused, buttonRef);

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.button}
        onKeyDown={onKeyDown}
        onClick={() => {
          onClick && onClick();
          handleOpen();
        }}
        tabIndex={tabIndex}
      >
        <PaletteColor
          color={color}
          screenReaderLabel={`Color ${color.id}. Click to change.`}
        />
      </button>
      <ColorPickerModal
        isOpen={isOpen}
        originElement={buttonRef.current}
        color={color}
        systemPalette={systemPalette}
        onChange={onChange}
        onClose={handleClose}
      />
    </>
  );
};

export default PaletteColorInput;
