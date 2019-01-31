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
  originX: number;
  originY: number;
};

const initialState: State = {
  isOpen: false,
  originElement: null,
  originX: 0,
  originY: 0
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

  const handleClick = React.useCallback(
    () => {
      if (onClick) {
        onClick();
      }

      const originElement = buttonRef.current;

      if (!dialogState.isOpen && originElement) {
        const rect = originElement.getBoundingClientRect();
        const originY = rect.top + rect.height / 2;
        const originX = rect.left + rect.width / 2;

        // TODO remove originX and originY
        setDialogState({
          isOpen: true,
          originElement,
          originX,
          originY
        });
      }
    },
    [onClick, buttonRef, dialogState]
  );

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
