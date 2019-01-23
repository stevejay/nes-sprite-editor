import React from "react";
import styles from "./Toolbar.module.scss";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

type Props = {
  ariaLabel: string;
  ariaOrientation?: "vertical" | "horizontal";
  className?: string;
  reducer: (tabIndex: number) => number;
  children: (
    tabIndex: number,
    setTabIndex: React.Dispatch<React.SetStateAction<number>>
  ) => React.ReactNode;
};

const Toolbar: React.FunctionComponent<Props> = ({
  ariaLabel,
  ariaOrientation,
  className = "",
  reducer,
  children
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [tabIndex, setTabIndex] = React.useState(-1);

  // React.useLayoutEffect(() => {
  //   if (tabIndex < 0 || !divRef || !divRef.current) {
  //     return;
  //   }

  //   const elements = divRef.current.getElementsByClassName(
  //     TOOLBAR_CHILD_CLASS_NAME
  //   );

  //   if (elements && elements.length > tabIndex) {
  //     (elements[tabIndex] as any).focus();
  //   }
  // });

  const handleContainerKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    switch (event.keyCode) {
      case ARROW_LEFT:
        setTabIndex(reducer(tabIndex - 1));
        break;
      case ARROW_RIGHT:
        setTabIndex(reducer(tabIndex === -1 ? 1 : tabIndex + 1));
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
      onKeyDown={handleContainerKeyDown}
    >
      {children(tabIndex, setTabIndex)}
    </div>
  );
};

export default Toolbar;
