import React, { Ref } from "react";
import styles from "./Container.module.scss";

type Props = {
  children: React.ReactNode;
  onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
};

const Container = React.forwardRef(
  (
    { children, onMouseMove, onMouseDown, onMouseUp }: Props,
    ref: Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={styles.container}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  )
);

export default Container;
