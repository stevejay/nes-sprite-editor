export type ModalPosition = {
  basicPosition: "left" | "right" | "top" | "bottom";
  arrowPosition: "start" | "end" | "center";
  fits: boolean;
  left: number;
  top: number;
};

export default function getValidTooltipPositions(
  targetTop: number,
  targetLeft: number,
  targetWidth: number,
  targetHeight: number,
  clientWidth: number,
  clientHeight: number,
  tooltipWidth: number,
  tooltipHeight: number,
  pointerSize: number
) {
  const result: Array<ModalPosition> = [];

  // ----- Vertical positions -----

  const horizontalSlidePosition = getPosition(
    0,
    clientWidth,
    targetLeft,
    targetLeft + targetWidth,
    tooltipWidth
  );

  // bottom position

  const bottomPosition: ModalPosition = {
    basicPosition: "bottom",
    arrowPosition: horizontalSlidePosition.arrowPosition,
    fits: true,
    left: horizontalSlidePosition.value,
    top: targetTop + targetHeight + pointerSize * 0.5
  };

  bottomPosition.fits = determineIfFits(
    bottomPosition,
    clientWidth,
    clientHeight,
    tooltipWidth,
    tooltipHeight
  );

  result.push(bottomPosition);

  if (bottomPosition.fits) {
    return result;
  }

  // top position

  const topPosition: ModalPosition = {
    basicPosition: "top",
    arrowPosition: horizontalSlidePosition.arrowPosition,
    fits: true,
    left: horizontalSlidePosition.value,
    top: targetTop - tooltipHeight - pointerSize * 0.5
  };

  topPosition.fits = determineIfFits(
    topPosition,
    clientWidth,
    clientHeight,
    tooltipWidth,
    tooltipHeight
  );

  result.push(topPosition);

  // ----- Horizontal positions -----

  const verticalSlidePosition = getPosition(
    0,
    clientHeight,
    targetTop,
    targetTop + targetHeight,
    tooltipHeight
  );

  // right position:

  const rightPosition: ModalPosition = {
    basicPosition: "right",
    arrowPosition: verticalSlidePosition.arrowPosition,
    fits: false,
    left: targetLeft + targetWidth + pointerSize * 0.5,
    top: verticalSlidePosition.value
  };

  rightPosition.fits = determineIfFits(
    rightPosition,
    clientWidth,
    clientHeight,
    tooltipWidth,
    tooltipHeight
  );

  result.push(rightPosition);

  // left position:

  const leftPosition: ModalPosition = {
    basicPosition: "left",
    arrowPosition: verticalSlidePosition.arrowPosition,
    fits: false,
    left: targetLeft - tooltipWidth - pointerSize * 0.5,
    top: verticalSlidePosition.value
  };

  leftPosition.fits = determineIfFits(
    leftPosition,
    clientWidth,
    clientHeight,
    tooltipWidth,
    tooltipHeight
  );

  result.push(leftPosition);

  return result;
}

function determineIfFits(
  position: ModalPosition,
  clientWidth: number,
  clientHeight: number,
  tooltipWidth: number,
  tooltipHeight: number
) {
  return (
    position.left >= 0 &&
    position.left + tooltipWidth <= clientWidth &&
    position.top >= 0 &&
    position.top + tooltipHeight <= clientHeight
  );
}

function getPosition(
  rangeMinValue: number,
  rangeMaxValue: number,
  anchorMinValue: number,
  anchorMaxValue: number,
  elementToPositionDimension: number
): { value: number; arrowPosition: "start" | "end" | "center" } {
  const preferredValue =
    anchorMinValue +
    (anchorMaxValue - anchorMinValue) * 0.5 -
    elementToPositionDimension * 0.5;
  if (preferredValue <= rangeMinValue) {
    return { value: anchorMinValue, arrowPosition: "start" };
  }
  if (preferredValue + elementToPositionDimension >= rangeMaxValue) {
    return {
      value: anchorMaxValue - elementToPositionDimension,
      arrowPosition: "end"
    };
  }
  return { value: preferredValue, arrowPosition: "center" };
}
