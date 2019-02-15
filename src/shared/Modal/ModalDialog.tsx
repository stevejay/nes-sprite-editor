import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring/renderprops"; // TODO change to hook?
import { useAriaHidden, usePreventBodyScroll, ModalBackdrop } from ".";
import styles from "./ModalDialog.module.scss";

const CONFIG = { duration: 200 };
const FROM_AND_LEAVE = { opacity: 0, transform: "scale(1.1)" };
const ENTER = { opacity: 1, transform: "scale(1)" };

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const ModalDialog = ({ isOpen, children, onClose }: Props) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  return (
    <Transition
      config={CONFIG}
      items={isOpen}
      from={FROM_AND_LEAVE}
      enter={ENTER}
      leave={FROM_AND_LEAVE}
    >
      {isOpen =>
        isOpen &&
        (props => (
          <Portal>
            <>
              <ModalBackdrop opacity={props.opacity * 0.5} onClose={onClose} />
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
  ModalDialog,
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
