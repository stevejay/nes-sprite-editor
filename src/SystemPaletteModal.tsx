import React from "react";
import FocusTrap from "focus-trap-react";
import styles from "./SystemPaletteModal.module.scss";
import usePreventBodyScroll from "./use-prevent-body-scroll";
import useAriaHidden from "./use-aria-hidden";
import { Transition } from "react-spring";
import { Portal } from "react-portal";
import ModalBackdrop from "./ModalBackdrop";
import { Color, SystemPalette } from "./types";
import PaletteInput from "./PaletteInput";

type Props = {
  isOpen: boolean;
  color: Color;
  systemPalette: SystemPalette;
  originX: number;
  originY: number;
  onChange: (color: Color) => void;
  onClose: () => void;
};

const CONFIG = { duration: 0 };
const FROM_AND_LEAVE = { opacity: 0 };
const ENTER = { opacity: 1 };

const SystemPaletteModal: React.FunctionComponent<Props> = React.memo(
  ({ isOpen, color, systemPalette, originX, originY, onChange, onClose }) => {
    usePreventBodyScroll(isOpen);
    useAriaHidden(isOpen);

    return (
      <Transition
        items={isOpen}
        config={CONFIG}
        from={FROM_AND_LEAVE}
        enter={ENTER}
        leave={FROM_AND_LEAVE}
      >
        {isOpen =>
          isOpen &&
          (style => (
            <Portal>
              <>
                <ModalBackdrop opacity={0} />
                <FocusTrap
                  focusTrapOptions={{
                    returnFocusOnDeactivate: true,
                    clickOutsideDeactivates: true,
                    onDeactivate: onClose
                  }}
                >
                  <div
                    className={styles.positionContainer}
                    style={{
                      left: `${originX + 38}px`,
                      top: `${originY}px`
                    }}
                  >
                    <div className={styles.modalChrome} style={style}>
                      <PaletteInput
                        palette={systemPalette}
                        selectedColorId={color.id}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </FocusTrap>
              </>
            </Portal>
          ))
        }
      </Transition>
    );
  }
);

export default SystemPaletteModal;
