import FocusTrap from "focus-trap-react";
import React from "react";
import { Portal } from "react-portal";
import {
  PatternTable as PatternTableType,
  GamePaletteWithColors
} from "../store";
import {
  useAriaHidden,
  usePreventBodyScroll,
  PointingModalContainer,
  ModalBackdrop
} from "../../../shared/Modal";
import { Transition } from "react-spring/renderprops"; // TODO change to hook
import PatternTable from "./PatternTable";

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
                  <PatternTable
                    scale={3}
                    patternTable={patternTable}
                    palette={palette}
                    tileIndex={selectedTileIndex}
                    onSelectTile={index => {
                      onSelectTile(index);
                      // onClose();
                    }}
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
  PatternTableModal,
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
