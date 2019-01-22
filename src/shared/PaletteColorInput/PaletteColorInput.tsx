import React from "react";
import ColorPickerModal from "./ColorPickerModal";
import PaletteColor from "./PaletteColor";
import styles from "./PaletteColorInput.module.scss";
import { Color, SystemPalette } from "../../types";

type Props = {
  color: Color;
  systemPalette: SystemPalette; // TODO remove this when using redux
  tabIndex?: number;
  onChange: (color: Color) => void;
};

type State = {
  isOpen: boolean;
  originElement: HTMLElement | null;
  originX: number;
  originY: number;
};

const initialState: State = {
  isOpen: false,
  originElement: null,
  originX: 0,
  originY: 0
};

const PaletteColorInput: React.FunctionComponent<Props> = ({
  color,
  systemPalette,
  tabIndex = 0,
  onChange
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [dialogState, setDialogState] = React.useState<State>(initialState);

  const handleClick = () => {
    const originElement = buttonRef.current;

    // if (!dialogState.isOpen) {
    //   console.log(
    //     ' && document.getElementById("color-picker")',
    //     document.getElementById("color-picker")
    //   );
    // }

    if (!dialogState.isOpen && originElement) {
      const rect = originElement.getBoundingClientRect();
      const originY = rect.top + rect.height / 2;
      const originX = rect.left + rect.width / 2;

      setDialogState({
        isOpen: true,
        originElement,
        originX,
        originY
      });
    }
  };

  const handleClose = () => {
    setDialogState(initialState);
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.button}
        onClick={handleClick}
        tabIndex={tabIndex}
      >
        <PaletteColor
          color={color}
          srLabel={`Color ${color.id}. Click to change.`}
        />
      </button>
      <ColorPickerModal
        {...dialogState}
        color={color}
        systemPalette={systemPalette}
        onChange={onChange}
        onClose={handleClose}
      />
    </>
  );
};

export default PaletteColorInput;
