import React from "react";
import styles from "./PointingModalContainer.module.scss";

type Props = {
  children: React.ReactNode;
  originElement: HTMLElement | null;
  originX: number;
  originY: number;
};

const PointingModalContainer = React.forwardRef<any, Props>(
  ({ children, originX, originY }, ref) => (
    <div
      ref={ref}
      className={styles.container}
      style={{
        left: `${originX + 38}px`,
        top: `${originY}px`
      }}
    >
      {children}
    </div>
  )
);

export default PointingModalContainer;
