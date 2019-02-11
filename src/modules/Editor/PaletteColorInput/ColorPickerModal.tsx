import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import ColorPicker from "./ColorPicker";
import { Color, SystemPalette } from "../../../model";
import {
  useAriaHidden,
  usePreventBodyScroll,
  PointingModalContainer,
  ModalBackdrop
} from "../../../shared/Modal";
import { Transition } from "react-spring/renderprops"; // TODO change to hook

type Props = {
  isOpen: boolean;
  color: Color;
  systemPalette: SystemPalette;
  originElement: HTMLElement | null;
  onChange: (color: Color) => void;
  onClose: () => void;
};

const ColorPickerModal: React.FunctionComponent<Props> = ({
  isOpen,
  color,
  systemPalette,
  originElement,
  onChange,
  onClose
}) => {
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
