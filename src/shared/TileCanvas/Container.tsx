import React, { Ref } from "react";
import styles from "./Container.module.scss";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
  onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
};

const Container = React.forwardRef(
  ({ className, ...rest }: Props, ref: Ref<HTMLDivElement>) => {
    const containerClassName = classNames(styles.container, className);
    return <div {...rest} ref={ref} className={containerClassName} />;
  }
);

export default Container;
