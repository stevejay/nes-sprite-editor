import React, { FunctionComponent } from "react";
import ColorPickerModal from "./ColorPickerModal";
import PaletteColor from "../PaletteColor";
import styles from "./PaletteColorInput.module.scss";
import { Color, SystemPalette } from "../../types";
import useFocused from "../utils/use-focus-effect";

type Props = {
  color: Color;
  systemPalette: SystemPalette; // TODO remove this when using redux
  tabIndex?: number;
  focused?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<any>) => void;
  onClick?: () => void;
  onChange: (color: Color) => void;
};

type State = {
  isOpen: boolean;
  originElement: HTMLElement | null;
};

const initialState: State = {
  isOpen: false,
  originElement: null
};

const PaletteColorInput = ({
  color,
  systemPalette,
  tabIndex = 0,
  focused,
  onKeyDown,
  onClick,
  onChange
}: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [dialogState, setDialogState] = React.useState<State>(initialState);
  useFocused(focused, buttonRef);

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }

    const originElement = buttonRef.current;

    if (!dialogState.isOpen && originElement) {
      setDialogState({ isOpen: true, originElement });
    }
  }, [onClick, buttonRef, dialogState]);

  const handleClose = () => {
    setDialogState(initialState);
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.button}
        onKeyDown={onKeyDown}
        onClick={handleClick}
        tabIndex={tabIndex}
      >
        <PaletteColor
          color={color}
          screenReaderLabel={`Color ${color.id}. Click to change.`}
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
