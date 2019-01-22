import React, { ReactElement } from "react";
import styles from "./Toolbar.module.scss";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

type Props = {
  ariaLabel: string;
  ariaOrientation?: "vertical" | "horizontal";
  className?: string;
  children: React.ReactNode;
};

const Toolbar: React.FunctionComponent<Props> = ({
  ariaLabel,
  ariaOrientation,
  className = "",
  children
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [tabIndex, setTabIndex] = React.useState(-1);
  const childRefs = React.useRef<Array<React.RefObject<any>>>([]);

  React.useLayoutEffect(
    () => {
      if (
        tabIndex >= 0 &&
        childRefs &&
        childRefs.current &&
        childRefs.current.length > tabIndex
      ) {
        const childRef: any = childRefs.current[tabIndex];
        childRef.focus && childRef.focus();
      }
    },
    [tabIndex]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.keyCode) {
      case ARROW_LEFT:
        setTabIndex(
          tabIndex <= 0 ? React.Children.count(children) - 1 : tabIndex - 1
        );
        break;
      case ARROW_RIGHT:
        setTabIndex(
          tabIndex >= React.Children.count(children) - 1
            ? 0
            : tabIndex === -1
            ? 1
            : tabIndex + 1
        );
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={divRef}
      aria-label={ariaLabel}
      aria-orientation={ariaOrientation}
      className={`${styles.toolbar} ${className}`}
      role="toolbar"
      onKeyDown={handleKeyDown}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as ReactElement<any>, {
          tabIndex:
            tabIndex === -1 && index === 0 ? 0 : index === tabIndex ? 0 : -1,
          ref: (ref: any) => childRefs.current.push(ref),
          onClick: () => setTabIndex(index)
        })
      )}
    </div>
  );
};

export default Toolbar;
