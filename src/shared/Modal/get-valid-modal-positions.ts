import { clamp } from "lodash";

export type ModalPosition = {
  basicPosition: "left" | "right" | "top" | "bottom";
  fits: boolean;
  left: number;
  top: number;
  pointerLeft: number;
  pointerTop: number;
};

export default function getValidModalPositions(
  targetClientRect: ClientRect | DOMRect,
  containerClientRect: ClientRect | DOMRect,
  modalWidth: number,
  modalHeight: number
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

  // left position:

  const leftPosition: ModalPosition = {
    basicPosition: "left",
    fits: true,
    left: targetClientRect.left - modalWidth,
    top: verticalSlidePosition,
    pointerLeft: modalWidth,
    pointerTop: 0
  };

  leftPosition.pointerTop = clamp(
    targetClientRect.top + halfTargetHeight - leftPosition.top,
    0,
    modalHeight
  );

  result.push(leftPosition);

  // right position:

  const rightPosition: ModalPosition = {
    basicPosition: "right",
    fits: true,
    left: targetClientRect.right,
    top: verticalSlidePosition,
    pointerLeft: 0,
    pointerTop: 0
  };

  rightPosition.pointerTop = clamp(
    targetClientRect.top + halfTargetHeight - rightPosition.top,
    0,
    modalHeight
  );

  result.push(rightPosition);

  // top position

  const topPosition: ModalPosition = {
    basicPosition: "top",
    fits: true,
    left: horizontalSlidePosition,
    top: targetClientRect.top - modalHeight,
    pointerLeft: 0,
    pointerTop: modalHeight
  };

  topPosition.pointerLeft = clamp(
    targetClientRect.left + halfTargetWidth - topPosition.left,
    0,
    modalWidth
  );

  result.push(topPosition);

  // bottom position

  const bottomPosition: ModalPosition = {
    basicPosition: "bottom",
    fits: true,
    left: horizontalSlidePosition,
    top: targetClientRect.bottom,
    pointerLeft: 0,
    pointerTop: 0
  };

  bottomPosition.pointerLeft = clamp(
    targetClientRect.left + halfTargetWidth - bottomPosition.left,
    0,
    modalWidth
  );

  result.push(bottomPosition);

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
