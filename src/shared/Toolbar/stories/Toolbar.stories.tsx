import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import styles from "./Toolbar.stories.module.scss";
import Toolbar, { TOOLBAR_CHILD_CLASS_NAME } from "..";
import "../../../index.scss";

import NewToolbar from "../NewToolbar";

const buttonHost = host({
  align: "center middle",
  backdrop: "transparent"
});

type Props = {
  children: React.ReactNode;
};

const Button: React.FunctionComponent<Props> = ({ children, ...rest }) => (
  <button {...rest} className={`${styles.button} ${TOOLBAR_CHILD_CLASS_NAME}`}>
    {children}
  </button>
);

const TempButton: React.FunctionComponent<any> = ({
  tabIndex,
  forceAsTabStop,
  onClick,
  children
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useLayoutEffect(
    () => {
      if (tabIndex !== 0 || !ref || !ref.current) {
        return;
      }
      // console.log("test", document.activeElement, ref.current);
      // if (document.activeElement === ref.current) {
      //   console.log("current has active");
      // }
      ref.current.focus();
    },
    [tabIndex]
  );

  return (
    <button
      ref={ref}
      tabIndex={tabIndex === -1 && forceAsTabStop ? 0 : tabIndex}
      className={`${styles.button}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

storiesOf("Toolbar", module)
  .addDecorator(buttonHost)
  .add("Basic", () => (
    <Toolbar ariaLabel="The toolbar label">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Toolbar>
  ))
  .add("Temp", () => (
    <NewToolbar
      ariaLabel="The toolbar label"
      reducer={newIndex => {
        if (newIndex >= 3) {
          return 0;
        }
        if (newIndex < 0) {
          return 2;
        }
        return newIndex;
      }}
    >
      {(tabIndex, setTabIndex) => (
        <>
          <TempButton
            tabIndex={tabIndex === 0 ? 0 : -1}
            forceAsTabStop={tabIndex === -1}
            onClick={() => setTabIndex(0)}
          >
            One
          </TempButton>
          <TempButton
            tabIndex={tabIndex === 1 ? 0 : -1}
            onClick={() => setTabIndex(1)}
          >
            Two
          </TempButton>
          <TempButton
            tabIndex={tabIndex === 2 ? 0 : -1}
            onClick={() => setTabIndex(2)}
          >
            Three
          </TempButton>
        </>
      )}
    </NewToolbar>
  ));
