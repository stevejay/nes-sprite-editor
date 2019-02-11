import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring/renderprops"; // TODO change to hook?
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
      from={{ opacity: 0, transform: "scale(1.1)" }}
      enter={{ opacity: 1, transform: "scale(1)" }}
      leave={{ opacity: 0, transform: "scale(1.1)" }}
    >
      {isOpen =>
        isOpen &&
        (props => (
          <Portal>
            <>
              <ModalBackdrop opacity={props.opacity / 2} onClose={onClose} />
              <div className={styles.scrollContainer}>
                <FocusTrap
                  focusTrapOptions={{
                    clickOutsideDeactivates: true,
                    onDeactivate: onClose
                  }}
                >
                  <div className={styles.positioningContainer}>
                    <section className={styles.chromeContainer} style={props}>
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
