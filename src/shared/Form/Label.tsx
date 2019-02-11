import React from "react";
import styles from "./Label.module.scss";

type Props = {
  forId: string;
  label: string;
};

const Label = ({ forId, label }: Props) => (
  <label className={styles.label} htmlFor={forId}>
    {label}
  </label>
);

export default Label;
