import React from "react";
import styles from "./CodePanel.module.scss";

type Props = {
  children: React.ReactNode;
};

const CodePanel: React.FunctionComponent<Props> = ({ children }) => (
  <pre className={styles.pre}>{children}</pre>
);

export default CodePanel;
