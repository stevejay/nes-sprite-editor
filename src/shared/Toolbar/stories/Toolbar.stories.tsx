import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import styles from "./Toolbar.stories.module.scss";
import Toolbar, { TOOLBAR_CHILD_CLASS_NAME } from "..";
import "../../../index.scss";

import NewToolbar from "../NewToolbar";

const storyHost = host({
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

type TempProps = {
  tabIndex: {
    tabIndex: number;
    origin: string;
  };
  index: number;
  onClick: any;
  children: React.ReactNode;
};

const TempButton: React.FunctionComponent<TempProps> = ({
  tabIndex,
  index,
  onClick,
  children
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useLayoutEffect(
    () => {
      if (
        tabIndex.origin !== "key" ||
        tabIndex.tabIndex !== index ||
        !ref ||
        !ref.current
      ) {
        return;
      }
      ref.current.focus();
    },
    [tabIndex]
  );

  return (
    <button
      ref={ref}
      tabIndex={tabIndex.tabIndex === index ? 0 : -1}
      className={`${styles.button}`}
      onClick={onClick}
      onKeyDown={() => console.log("onkeydown!!")}
    >
      {children}
    </button>
  );
};

storiesOf("Toolbar", module)
  .addDecorator(storyHost)
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
            tabIndex={tabIndex}
            index={0}
            onClick={() => setTabIndex({ tabIndex: 0, origin: "mouse" })}
          >
            One
          </TempButton>
          <TempButton
            tabIndex={tabIndex}
            index={1}
            onClick={() => setTabIndex({ tabIndex: 1, origin: "mouse" })}
          >
            Two
          </TempButton>
          <TempButton
            tabIndex={tabIndex}
            index={2}
            onClick={() => setTabIndex({ tabIndex: 2, origin: "mouse" })}
          >
            Three
          </TempButton>
        </>
      )}
    </NewToolbar>
  ));
