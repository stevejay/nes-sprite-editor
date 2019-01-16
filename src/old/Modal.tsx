import * as React from "react";
import FocusTrap from "focus-trap-react";
import ModalBackdrop from "../ModalBackdrop";
import styles from "./Modal.module.scss";
import { Portal } from "react-portal";
import { Transition } from "react-spring";
import usePreventBodyScroll from "../use-prevent-body-scroll";
import useAriaHidden from "../use-aria-hidden";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement<any>;
};

const Modal: React.FunctionComponent<Props> = ({
  isOpen,
  children,
  onClose
}) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  return (
    <Transition
      config={{ duration: 200 }}
      items={isOpen}
      from={{ opacity: 0, transform: "translateY(10px)" }}
      enter={{ opacity: 1, transform: "translateY(0px)" }}
      leave={{ opacity: 0, transform: "translateY(10px)" }}
    >
      {isOpen =>
        isOpen &&
        (({ opacity, transform }) => (
          <Portal>
            <>
              <ModalBackdrop opacity={opacity} />
              <FocusTrap
                focusTrapOptions={{
                  returnFocusOnDeactivate: true,
                  clickOutsideDeactivates: true,
                  onDeactivate: onClose
                }}
              >
                <div className={styles.scrollContainer}>
                  <div className={styles.positionContainer}>
                    <div
                      className={styles.modalChrome}
                      style={{ opacity, transform }}
                    >
                      Fooo <button onClick={onClose}>Hey</button>
                    </div>
                  </div>
                </div>
              </FocusTrap>
            </>
          </Portal>
        ))
      }
    </Transition>
  );
};

export default Modal;
