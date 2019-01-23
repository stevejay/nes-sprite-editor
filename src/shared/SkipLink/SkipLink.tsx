import React from "react";
import styles from "./SkipLink.module.scss";

type Props = {
  href: string;
  children: React.ReactNode;
};

// A useful a11y tool:
// https://gomakethings.com/hidden-content-for-better-a11y/#the-skip-link
const SkipLink: React.FunctionComponent<Props> = ({ href, children }) => (
  <a className={styles.link} href={href}>
    {children}
  </a>
);

export default SkipLink;
