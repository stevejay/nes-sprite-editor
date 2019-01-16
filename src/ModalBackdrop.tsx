import React from "react";
import styles from "./ModalBackdrop.module.scss";

type Props = {
  opacity: number;
};

const ModalBackdrop: React.FunctionComponent<Props> = props => (
  <div className={styles.backdrop} tabIndex={-1} style={props} />
);

export default ModalBackdrop;
