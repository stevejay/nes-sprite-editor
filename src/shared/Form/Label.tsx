import React from "react";
import styles from "./Label.module.scss";

type Props = {
  forId: string;
  children: React.ReactNode;
};

const Label = ({ forId, children }: Props) => (
  <label className={styles.label} htmlFor={forId}>
    {children}
  </label>
);

export default Label;
