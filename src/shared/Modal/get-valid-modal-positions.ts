import { clamp } from "lodash";

export type ModalPosition = {
  basicPosition: "left" | "right" | "top" | "bottom";
  fits: boolean;
  left: number;
  top: number;
  pointer: number;
};

export default function getValidModalPositions(
  targetClientRect: ClientRect | DOMRect,
  containerClientRect:
    | ClientRect
    | DOMRect
    | {
        left: number;
        top: number;
        right: number;
        bottom: number;
      },
  modalWidth: number,
  modalHeight: number,
  pointerSize: number
) {
  const targetWidth = targetClientRect.right - targetClientRect.left;
  const halfTargetWidth = targetWidth * 0.5;
  const targetHeight = targetClientRect.bottom - targetClientRect.top;
  const halfTargetHeight = targetHeight * 0.5;

  const verticalSlidePosition = slidePosition(
    containerClientRect.top,
    containerClientRect.bottom,
    modalHeight,
    targetClientRect.top + halfTargetHeight
  );

  const horizontalSlidePosition = slidePosition(
    containerClientRect.left,
    containerClientRect.right,
    modalWidth,
    targetClientRect.left + halfTargetWidth
  );

  const result: Array<ModalPosition> = [];

  // right position:

  const rightPosition: ModalPosition = {
    basicPosition: "right",
    fits: true,
    left: targetClientRect.right + pointerSize * 0.5,
    top: verticalSlidePosition,
    pointer: 0
  };

  rightPosition.pointer =
    (100 / modalHeight) *
    clamp(
      targetClientRect.top + halfTargetHeight - rightPosition.top,
      pointerSize,
      modalHeight - pointerSize
    );

  result.push(rightPosition);

  // left position:

  const leftPosition: ModalPosition = {
    basicPosition: "left",
    fits: true,
    left: targetClientRect.left - modalWidth - pointerSize * 0.5,
    top: verticalSlidePosition,
    pointer: 0
  };

  leftPosition.pointer =
    (100 / modalHeight) *
    clamp(
      targetClientRect.top + halfTargetHeight - leftPosition.top,
      pointerSize,
      modalHeight - pointerSize
    );

  result.push(leftPosition);

  // bottom position

  const bottomPosition: ModalPosition = {
    basicPosition: "bottom",
    fits: true,
    left: horizontalSlidePosition,
    top: targetClientRect.bottom + pointerSize * 0.5,
    pointer: 0
  };

  bottomPosition.pointer =
    (100 / modalWidth) *
    clamp(
      targetClientRect.left + halfTargetWidth - bottomPosition.left,
      pointerSize,
      modalWidth - pointerSize
    );

  result.push(bottomPosition);

  // top position

  const topPosition: ModalPosition = {
    basicPosition: "top",
    fits: true,
    left: horizontalSlidePosition,
    top: targetClientRect.top - modalHeight - pointerSize * 0.5,
    pointer: 0
  };

  topPosition.pointer =
    (100 / modalWidth) *
    clamp(
      targetClientRect.left + halfTargetWidth - topPosition.left,
      pointerSize,
      modalWidth - pointerSize
    );

  result.push(topPosition);

  // for each position, see if it is a valid position or not
  result.forEach(position => {
    if (
      position.left < containerClientRect.left ||
      position.left + modalWidth > containerClientRect.right ||
      position.top < containerClientRect.top ||
      position.top + modalHeight > containerClientRect.bottom
    ) {
      position.fits = false;
    }
  });

  return result;
}

function slidePosition(
  rangeStart: number,
  rangeEnd: number,
  coverSize: number,
  gravityPoint: number
) {
  let result = gravityPoint - coverSize * 0.5;
  if (result + coverSize > rangeEnd) {
    result = rangeEnd - coverSize;
  }
  if (result < rangeStart) {
    result = rangeStart;
  }
  return result;
}
