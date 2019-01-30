import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring";
import { useAriaHidden, usePreventBodyScroll, ModalBackdrop } from ".";
import styles from "./ModalDialog.module.scss";

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ isOpen, children, onClose }: Props) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  return (
    <Transition
      config={{ duration: 200 }}
      items={isOpen}
      from={{ opacity: 0, transform: "translateY(-10px)" }}
      enter={{ opacity: 1, transform: "translateY(0px)" }}
      leave={{ opacity: 0, transform: "translateY(-10px)" }}
    >
      {isOpen =>
        isOpen &&
        (({ opacity, transform }) => (
          <Portal>
            <>
              <ModalBackdrop opacity={opacity / 2} onClose={onClose} />
              <div className={styles.scrollContainer}>
                <FocusTrap
                  focusTrapOptions={{
                    clickOutsideDeactivates: true,
                    onDeactivate: onClose
                  }}
                >
                  <div className={styles.positioningContainer}>
                    <section
                      className={styles.chromeContainer}
                      style={{ opacity, transform }}
                    >
                      {children}
                    </section>
                  </div>
                </FocusTrap>
              </div>
            </>
          </Portal>
        ))
      }
    </Transition>
  );
};

export default React.memo(
  Modal,
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
