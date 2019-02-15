import React, { Ref } from "react";
import styles from "./Container.module.scss";

type Props = {
  children: React.ReactNode;
  onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
};

const Container = React.forwardRef((props: Props, ref: Ref<HTMLDivElement>) => (
  <div {...props} ref={ref} className={styles.container} />
));

export default Container;
