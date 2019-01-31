import React from "react";
import styles from "./ButtonContainer.module.scss";

type Props = {
  children: React.ReactNode;
};

const ButtonContainer = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);

export default ButtonContainer;
