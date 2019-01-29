import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Color, SystemPalette } from "../../types";
import {
  useAriaHidden,
  usePreventBodyScroll,
  ModalBackdrop
} from "../../shared/Modal";
import Button from "../../shared/Button";
import ModalContainer from "../../shared/Modal/ModalContainer";

type Props = {
  isOpen: boolean;
  // color: Color;
  // systemPalette: SystemPalette;
  // originX: number;
  // originY: number;
  // originElement: HTMLElement | null;
  // onChange: (color: Color) => void;
  onClose: () => void;
};

const RenameModal: React.FunctionComponent<Props> = ({
  isOpen,
  // color,
  // systemPalette,
  // originX,
  // originY,
  // originElement,
  // onChange,
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
        <ModalBackdrop opacity={0.5} onClose={onClose} />
        <FocusTrap focusTrapOptions={{ onDeactivate: onClose }}>
          <ModalContainer>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              Rename
            </Button>
          </ModalContainer>
        </FocusTrap>
      </>
    </Portal>
  );
};

export default React.memo(RenameModal);
