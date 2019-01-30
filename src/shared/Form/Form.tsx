import React from "react";
import styles from "./Form.module.scss";
import { FormRenderProps } from "react-final-form";

type Props = {
  onSubmit?: FormRenderProps["handleSubmit"];
  children: React.ReactNode;
};

const Form: React.FunctionComponent<Props> = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit} className={styles.form}>
    {children}
  </form>
);

export default Form;
