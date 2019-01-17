import React from "react";
import styles from "./PointingModalContainer.module.scss";

type Props = {
  children: React.ReactNode;
  originElement: HTMLElement | null;
  originX: number;
  originY: number;
};

// Note: implemented as a class component to allow focus trap to get ref.
class PointingModalContainer extends React.Component<Props> {
  render() {
    const { children, originX, originY } = this.props;
    return (
      <div
        className={styles.container}
        style={{
          left: `${originX + 38}px`,
          top: `${originY}px`
        }}
      >
        {children}
      </div>
    );
  }
}

export default PointingModalContainer;
