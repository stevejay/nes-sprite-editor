import React from "react";
import styles from "./Button.module.scss";

type Props = {
  children: React.ReactNode;
  tabIndex?: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Button: React.FunctionComponent<Props> = ({
  children,
  tabIndex = 0,
  onClick
}) => (
  <button className={styles.button} tabIndex={tabIndex} onClick={onClick}>
    {children}
  </button>
);

export default Button;
