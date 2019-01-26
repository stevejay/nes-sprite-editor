import React from "react";
import styles from "./MetatileTracker.module.scss";

type Props = {
  children: React.ReactNode;
  onChange: (type: string, value: { row: number; column: number }) => void;
};

const MetatileTracker: React.FunctionComponent<Props> = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleContainerClick = undefined;
  const handleKeyDown = undefined;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      className={styles.container}
    >
      {children}
    </div>
  );
};

export default MetatileTracker;
