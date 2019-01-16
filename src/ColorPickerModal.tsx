import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring";
import ColorPicker from "./ColorPicker";
import styles from "./ColorPickerModal.module.scss";
import ModalBackdrop from "./ModalBackdrop";
import PointingModalContainer from "./PointingModalContainer";
import { Color, SystemPalette } from "./types";
import useAriaHidden from "./use-aria-hidden";
import usePreventBodyScroll from "./use-prevent-body-scroll";

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

const CONFIG = { duration: 0 };
const FROM_AND_LEAVE = { opacity: 0 };
const ENTER = { opacity: 1 };

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
        <ModalBackdrop opacity={0} />
        <FocusTrap
          focusTrapOptions={{
            returnFocusOnDeactivate: true,
            clickOutsideDeactivates: true,
            onDeactivate: onClose
          }}
        >
          <PointingModalContainer
            originX={originX}
            originY={originY}
            originElement={originElement}
          >
            <div className={styles.modalChrome}>
              <ColorPicker
                palette={systemPalette}
                selectedColorId={color.id}
                onChange={onChange}
              />
            </div>
          </PointingModalContainer>
        </FocusTrap>
      </>
    </Portal>
  );

  // return (
  //   <Transition
  //     items={[
  //       { key: isOpen.toString(), isOpen, originX, originY, originElement }
  //     ]}
  //     keys={item => item.key}
  //     config={CONFIG}
  //     from={FROM_AND_LEAVE}
  //     enter={ENTER}
  //     leave={FROM_AND_LEAVE}
  //   >
  //     {item =>
  //       item.isOpen &&
  //       (style => (
  //         <Portal>
  //           <>
  //             <ModalBackdrop opacity={0} />
  //             <FocusTrap
  //               focusTrapOptions={{
  //                 returnFocusOnDeactivate: true,
  //                 clickOutsideDeactivates: true,
  //                 onDeactivate: onClose
  //               }}
  //             >
  //               <PointingModalContainer
  //                 originX={item.originX}
  //                 originY={item.originY}
  //                 originElement={item.originElement}
  //               >
  //                 <div className={styles.modalChrome} style={style}>
  //                   <ColorPicker
  //                     palette={systemPalette}
  //                     selectedColorId={color.id}
  //                     onChange={onChange}
  //                   />
  //                 </div>
  //               </PointingModalContainer>
  //             </FocusTrap>
  //           </>
  //         </Portal>
  //       ))
  //     }
  //   </Transition>
  // );
};

export default React.memo(
  ColorPickerModal,
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
