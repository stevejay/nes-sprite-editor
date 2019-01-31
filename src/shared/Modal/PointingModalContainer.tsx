import React, { useLayoutEffect } from "react";
import styles from "./PointingModalContainer.module.scss";
import { clamp, isEmpty, inRange } from "lodash";
import getValidModalPositions, {
  ModalPosition
} from "./get-valid-modal-positions";
import selectModalPosition from "./select-modal-position";

type Props = {
  children: React.ReactNode;
  originElement: HTMLElement | null;
  containerElement?: Element | null;
};

// TODO work out if I can avoid this wrapper class component
// (it provides the ref for ReactFocusTrap):
class PointingModalContainer extends React.Component<Props> {
  render() {
    return <PointingModalContainerInner {...this.props} />;
  }
}

const PointingModalContainerInner = ({
  children,
  originElement,
  containerElement
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref || !ref.current || !originElement) {
      return;
    }

    const containerClientRect = containerElement
      ? containerElement.getBoundingClientRect()
      : {
          left: 0,
          top: 0,
          right: window.innerWidth - 1,
          bottom: window.innerWidth - 1
        };

    const modalRect = ref.current.getBoundingClientRect();
    const widthToDisplay = clamp(modalRect.right - modalRect.left, 1, 10000);
    const heightToDisplay = clamp(modalRect.bottom - modalRect.top, 1, 10000);

    const positions = getValidModalPositions(
      originElement.getBoundingClientRect(),
      containerClientRect,
      widthToDisplay,
      heightToDisplay,
      14
    );

    const position = selectModalPosition(positions);
    ref.current.style.left = position.left + "px";
    ref.current.style.top = position.top + "px";
    ref.current.classList.add(position.basicPosition);
    ref.current.style.setProperty("--pointer-position", position.pointer + "%");
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      {children}
    </div>
  );
};

export default PointingModalContainer;
