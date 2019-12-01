import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring"; // TODO change to hook
import {
  ModalBackdrop,
  PointingModalContainer,
  useAriaHidden,
  usePreventBodyScroll
} from "../../../../shared/Modal";
import { Color, SystemPalette } from "../../store";
import ColorPicker from "./ColorPicker";

type Props = {
  isOpen: boolean;
  color: Color;
  systemPalette: SystemPalette;
  originElement: HTMLElement | null;
  onChange: (color: Color) => void;
  onClose: () => void;
};

const ColorPickerModal = ({
  isOpen,
  color,
  systemPalette,
  originElement,
  onChange,
  onClose
}: Props) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  return (
    <Transition
      config={{ duration: 150 }}
      items={isOpen}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
    >
      {isOpen =>
        isOpen &&
        (({ opacity }) => (
          <Portal>
            <>
              <ModalBackdrop opacity={0} onClose={onClose} />
              <FocusTrap focusTrapOptions={{ onDeactivate: onClose }}>
                <PointingModalContainer
                  originElement={originElement}
                  style={{ opacity }}
                >
                  <ColorPicker
                    palette={systemPalette}
                    selectedColorId={color.id}
                    scale={24}
                    onChange={onChange}
                  />
                </PointingModalContainer>
              </FocusTrap>
            </>
          </Portal>
        ))
      }
    </Transition>
  );
};

export default React.memo(
  ColorPickerModal,
  (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen && prevProps.color === nextProps.color
);
