import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring/renderprops";
import {
  ModalBackdrop,
  PointingModalContainer,
  useAriaHidden,
  usePreventBodyScroll
} from "../../../shared/Modal";
import {
  GamePaletteWithColors,
  PatternTable as PatternTableType
} from "../store";
import PatternTable from "./PatternTable";
import styles from "./PatternTableModal.module.scss";
// TODO change to hook

const CONFIG = { duration: 150 };
const FROM_AND_LEAVE = { opacity: 0 };
const ENTER = { opacity: 1 };

type Props = {
  isOpen: boolean;
  patternTable: PatternTableType | null;
  palette: GamePaletteWithColors;
  selectedTileIndex: number;
  originElement: HTMLElement | null;
  onSelectTile: (index: number) => void;
  onClose: () => void;
};

const PatternTableModal = ({
  isOpen,
  patternTable,
  palette,
  selectedTileIndex,
  originElement,
  onSelectTile,
  onClose
}: Props) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  if (!patternTable) {
    return null;
  }

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
        (({ opacity }) => (
          <Portal>
            <>
              <ModalBackdrop opacity={0} onClose={onClose} />
              <FocusTrap focusTrapOptions={{ onDeactivate: onClose }}>
                <PointingModalContainer
                  originElement={originElement}
                  style={{ opacity }}
                >
                  <PatternTable
                    scale={3}
                    patternTable={patternTable}
                    palette={palette}
                    tileIndex={selectedTileIndex}
                    containerClassName={styles.patternTableContainer}
                    onSelectTile={onSelectTile}
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

// export default PatternTableModal;

export default React.memo(
  PatternTableModal,
  (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.selectedTileIndex === nextProps.selectedTileIndex
);
