import React from "react";
import styles from "./Section.module.scss";

type Props = {
  children: React.ReactNode;
};

const Section: React.FunctionComponent<Props> = ({ children }) => (
  <section className={styles.section}>{children}</section>
);

export default Section;
