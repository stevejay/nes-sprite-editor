import React from "react";
import styles from "./ModalContainer.module.scss";

type Props = {
  children: React.ReactNode;
};

const ModalContainer = React.forwardRef<any, Props>(({ children }, ref) => (
  <div ref={ref} className={styles.container}>
    {children}
  </div>
));

export default ModalContainer;
