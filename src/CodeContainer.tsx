import React from "react";
import styles from "./CodeContainer.module.scss";

type Props = {
  children: React.ReactNode;
};

const CodeContainer: React.FunctionComponent<Props> = ({ children }) => (
  <pre className={styles.pre}>{children}</pre>
);

export default CodeContainer;
