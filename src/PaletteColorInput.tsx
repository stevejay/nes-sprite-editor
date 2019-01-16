import React from "react";
import { Color, SystemPalette } from "./types";
import styles from "./PaletteColorInput.module.scss";
import PaletteColor from "./PaletteColor";
import SystemPaletteModal from "./SystemPaletteModal";

type Props = {
  color: Color;
  systemPalette: SystemPalette;
  onChange: (color: Color) => void;
};

type State = {
  isOpen: boolean;
  originX: number;
  originY: number;
};

const PaletteColorInput: React.FunctionComponent<Props> = ({
  color,
  systemPalette,
  onChange
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [dialogState, setDialogState] = React.useState<State>({
    isOpen: false,
    originX: 0,
    originY: 0
  });

  const handleClick = () => {
    if (!dialogState.isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const originY = rect.top + rect.height / 2;
      const originX = rect.left + rect.width / 2;
      setDialogState({ isOpen: true, originX, originY });
    }
  };

  const handleClose = () => {
    setDialogState({ ...dialogState, isOpen: false });
  };

  return (
    <>
      <button ref={buttonRef} className={styles.button} onClick={handleClick}>
        <PaletteColor
          color={color}
          srLabel={`Color ${color.id}. Click to change.`}
        />
      </button>
      <SystemPaletteModal
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
