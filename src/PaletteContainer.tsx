import React from "react";
import styles from "./PaletteContainer.module.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PaletteContainer: React.FunctionComponent<Props> = ({
  children,
  className = ""
}) => <div className={`${styles.container} ${className}`}>{children}</div>;

export default PaletteContainer;
