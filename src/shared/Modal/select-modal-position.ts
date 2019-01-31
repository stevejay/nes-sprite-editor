import { ModalPosition } from "./get-valid-modal-positions";
import { isEmpty, inRange } from "lodash";

export default function selectModalPosition(positions: Array<ModalPosition>) {
  let position: ModalPosition | null = null;

  const fitsPositions = positions.filter(position => position.fits);
  if (!isEmpty(fitsPositions)) {
    const centralArrowPositions = fitsPositions.filter(position =>
      inRange(position.pointer, 48, 52)
    );
    if (!isEmpty(centralArrowPositions)) {
      position = centralArrowPositions[0];
    } else {
      position = fitsPositions[0];
    }
  } else {
    position = positions[0];
  }

  return position;
}
