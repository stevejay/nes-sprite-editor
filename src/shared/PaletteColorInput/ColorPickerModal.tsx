import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import ColorPicker from "./ColorPicker";
import { Color, SystemPalette } from "../../types";
import {
  useAriaHidden,
  usePreventBodyScroll,
  PointingModalContainer,
  ModalBackdrop
} from "../Modal";
// import { Transition } from "react-spring";
// import styles from "./ColorPickerModal.module.scss";

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

// const CONFIG = { duration: 0 };
// const FROM_AND_LEAVE = { opacity: 0 };
// const ENTER = { opacity: 1 };

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
            <ColorPicker
              palette={systemPalette}
              selectedColorId={color.id}
              onChange={onChange}
            />
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
  (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen && prevProps.color === nextProps.color
);
