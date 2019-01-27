import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import ColorPicker from "./ColorPicker";
import { Color, SystemPalette } from "../../types";
import {
  useAriaHidden,
  usePreventBodyScroll,
  PointingModalContainer,
  ModalBackdrop
} from "../Modal";

type Props = {
  isOpen: boolean;
  color: Color;
  systemPalette: SystemPalette;
  originX: number;
  originY: number;
  originElement: HTMLElement | null;
  onChange: (color: Color) => void;
  onClose: () => void;
};

const ColorPickerModal: React.FunctionComponent<Props> = ({
  isOpen,
  color,
  systemPalette,
  originX,
  originY,
  originElement,
  onChange,
  onClose
}) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <>
        <ModalBackdrop opacity={0} onClose={onClose} />
        <FocusTrap focusTrapOptions={{ onDeactivate: onClose }}>
          <PointingModalContainer
            originX={originX}
            originY={originY}
            originElement={originElement}
          >
            <ColorPicker
              palette={systemPalette}
              selectedColorId={color.id}
              scaling={24}
              onChange={onChange}
            />
          </PointingModalContainer>
        </FocusTrap>
      </>
    </Portal>
  );
};

export default React.memo(
  ColorPickerModal,
  (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen && prevProps.color === nextProps.color
);
