import * as React from "react";
import FocusTrap from "focus-trap-react";
import ModalBackdrop from "./ModalBackdrop";
import styles from "./Modal.module.scss";
import { Portal } from "react-portal";
import { Transition } from "react-spring";
import usePreventBodyScroll from "./use-prevent-body-scroll";
import useAriaHidden from "./use-aria-hidden";
// import posed, { PoseGroup } from "react-pose";
// import { clamp } from "lodash";
// import { TransitionMotion, spring, presets } from "react-motion";
// import { useTransition } from 'react-spring/hooks'
// import Animate from "react-move/Animate";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement<any>;
};

// const willEnter = () => ({ opacity: 0 });
// const willLeave = () => ({ opacity: spring(0, SPRING) });

// const useAriaHidden: (id?: string) => void = (id = "root") => {
//   React.useEffect(() => {
//     const appRoot = document.getElementById(id);
//     appRoot && appRoot.setAttribute("aria-hidden", "true");
//     return () => {
//       appRoot && appRoot.setAttribute("aria-hidden", "false");
//     };
//   }, []);
// };

// function useCallbackOnKeydown(
//   shouldUse: boolean,
//   keyCode: number,
//   callback: () => void
// ) {
//   React.useEffect(
//     () => {
//       if (!shouldUse) {
//         return;
//       }
//       const listener: EventListener = (event: any) =>
//         event.keyCode === keyCode && callback();
//       document.addEventListener("keydown", listener);
//       return () => document.removeEventListener("keydown", listener);
//     },
//     [shouldUse]
//   );
// }

// const FOCUS_TRAP_OPTIONS = {
//   returnFocusOnDeactivate: true,
//   clickOutsideDeactivates: true
// };
// const SPRING = { stiffness: 300, damping: 40, precision: 0.1 };
// const KEY_CODE_ESC = 27;

// Note: has to be a class component (for react-focus-trap)
// class ModalInner extends React.Component<Props> {
//   render() {
//     return this.props.children;
//   }
// }

// const ModalInner: React.SFC<Props> = ({ onClose, children }) => {
//   return children;
//   // useAriaHidden("root");
//   // useCallbackOnKeydown(KEY_CODE_ESC, onClose);
//   // return (
//   //   <FocusTrap focusTrapOptions={FOCUS_TRAP_OPTIONS}>{children}</FocusTrap>
//   // );
// };

// const START = { opacity: 0, translate: 10 };
// const ENTER_AND_UPDATE = { opacity: [1], translate: [0] };
// const LEAVE = { opacity: [0], translate: [10] };

// const Backdrop = posed.div({
//   enter: { opacity: 1, transition: { duration: 2000 } },
//   exit: { opacity: 0 }
// });

const Modal: React.FunctionComponent<Props> = ({
  isOpen,
  children,
  onClose
}) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  // const transitions = useTransition({
  //   config: { duration: 200 },
  //   items: isOpen,
  //   from: { opacity: 0, transform: "translateY(10px)" },
  //   enter: { opacity: 1, transform: "translateY(0px)" },
  //   leave: { opacity: 0, transform: "translateY(10px)" }
  // });

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

  // return (
  //   <Animate
  //     show={isOpen}
  //     start={START}
  //     enter={ENTER_AND_UPDATE}
  //     update={ENTER_AND_UPDATE}
  //     leave={LEAVE}
  //   >
  //     {({ opacity, translate }) => (
  //       <Portal>
  //         <>
  //           <div
  //             className={styles.backdrop}
  //             tabIndex={-1}
  //             // onClick={onClose}
  //             style={{ opacity: opacity as number }}
  //           />
  //           <FocusTrap
  //             focusTrapOptions={{
  //               returnFocusOnDeactivate: true,
  //               clickOutsideDeactivates: true,
  //               onDeactivate: onClose
  //             }}
  //           >
  //             <div className={styles.scrollContainer}>
  //               <div className={styles.positionContainer}>
  //                 <div
  //                   className={styles.modalChrome}
  //                   style={{
  //                     opacity: opacity as number,
  //                     transform: `translateY(${translate}px)`
  //                   }}
  //                 >
  //                   Fooo <button onClick={onClose}>Hey</button>
  //                 </div>
  //               </div>
  //             </div>
  //           </FocusTrap>
  //         </>
  //       </Portal>
  //     )}
  //   </Animate>
  // );
};

export default Modal;
