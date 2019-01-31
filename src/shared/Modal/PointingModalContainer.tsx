import React, { useLayoutEffect } from "react";
import styles from "./PointingModalContainer.module.scss";
import { clamp } from "lodash";
import getValidModalPositions from "./get-valid-modal-positions";

type Props = {
  children: React.ReactNode;
  originElement: HTMLElement | null;
  containerElement: Element | null;
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
    if (!ref || !ref.current || !originElement || !containerElement) {
      return;
    }

    const modalRect = ref.current.getBoundingClientRect();
    const widthToDisplay = clamp(modalRect.right - modalRect.left, 1, 10000);
    const heightToDisplay = clamp(modalRect.bottom - modalRect.top, 1, 10000);

    const positions = getValidModalPositions(
      originElement.getBoundingClientRect(),
      containerElement.getBoundingClientRect(),
      widthToDisplay,
      heightToDisplay
    );

    ref.current.style.left = positions[2].left + "px";
    ref.current.style.top = positions[2].top + "px";
    ref.current.classList.add(positions[2].basicPosition);

    ref.current.style.setProperty("--pointer-position", "25%");
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      {children}
    </div>
  );
};

export default PointingModalContainer;
