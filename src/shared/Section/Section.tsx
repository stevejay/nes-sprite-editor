import React from "react";
import styles from "./Section.module.scss";
import classNames from "classnames";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Section = ({ className, children }: Props) => {
  const sectionClassName = classNames(styles.section, className);
  return <section className={sectionClassName}>{children}</section>;
};

export default Section;
