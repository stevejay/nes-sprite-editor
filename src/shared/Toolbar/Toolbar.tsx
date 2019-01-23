import React, { ReactElement } from "react";
import styles from "./Toolbar.module.scss";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
export const TOOLBAR_CHILD_CLASS_NAME = "toolbar-child";

type Props = {
  ariaLabel: string;
  ariaOrientation?: "vertical" | "horizontal";
  className?: string;
  children: React.ReactNode;
};

// has roving tab index
const Toolbar: React.FunctionComponent<Props> = ({
  ariaLabel,
  ariaOrientation,
  className = "",
  children
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [tabIndex, setTabIndex] = React.useState(-1);

  React.useLayoutEffect(() => {
    if (tabIndex < 0 || !divRef || !divRef.current) {
      return;
    }

    const elements = divRef.current.getElementsByClassName(
      TOOLBAR_CHILD_CLASS_NAME
    );

    if (elements && elements.length > tabIndex) {
      (elements[tabIndex] as any).focus();
    }
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!divRef || !divRef.current) {
      return;
    }

    const elements = divRef.current.getElementsByClassName(
      TOOLBAR_CHILD_CLASS_NAME
    );

    switch (event.keyCode) {
      case ARROW_LEFT:
        setTabIndex(tabIndex <= 0 ? elements.length - 1 : tabIndex - 1);
        break;
      case ARROW_RIGHT:
        if (tabIndex >= elements.length - 1) {
          setTabIndex(0);
        } else if (tabIndex === -1) {
          if (elements.length > 1) {
            setTabIndex(1);
          }
        } else {
          setTabIndex(tabIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef || !divRef.current) {
      return;
    }

    const elements = divRef.current.getElementsByClassName(
      TOOLBAR_CHILD_CLASS_NAME
    );

    for (let i = 0; i < elements.length; ++i) {
      if (elements[i] !== event.target) {
        continue;
      }

      if (i !== tabIndex) {
        setTabIndex(i);
      }

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
      onClick={handleContainerClick}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as ReactElement<any>, {
          tabIndex:
            tabIndex === -1 && index === 0 ? 0 : index === tabIndex ? 0 : -1
        })
      )}
    </div>
  );
};

export default Toolbar;
