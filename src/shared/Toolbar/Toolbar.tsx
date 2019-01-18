import React, { ReactElement } from "react";
import styles from "./Toolbar.module.scss";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

type Props = {
  children: React.ReactNode;
};

const Toolbar: React.FunctionComponent<Props> = ({ children }) => {
  const divRef = React.useRef(null);
  const [tabIndex, setTabIndex] = React.useState(0);

  // React.useLayoutEffect(() => {
  //   // find tabbable children
  //   if (divRef && divRef.current) {

  //   }

  // }, [tabIndex]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === ARROW_LEFT) {
      setTabIndex(
        tabIndex === 0 ? React.Children.count(children) - 1 : tabIndex - 1
      );
    } else if (event.keyCode === ARROW_RIGHT) {
      setTabIndex(
        tabIndex >= React.Children.count(children) - 1 ? 0 : tabIndex + 1
      );
    }
  };

  return null;

  return (
    <div
      ref={divRef}
      className={styles.toolbar}
      role="toolbar"
      onKeyPress={handleKeyPress}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as ReactElement<any>, {
          tabIndex: index === tabIndex ? 0 : -1
        })
      )}
    </div>
  );
};

export default Toolbar;

// I would say "onKeyPress" because "onKeyDown" is used when you need to do something specific while this particular key is pressed.
