import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import styles from "./Toolbar.stories.module.scss";
import Toolbar, { TOOLBAR_CHILD_CLASS_NAME } from "..";
import "../../../index.scss";

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

storiesOf("Toolbar", module)
  .addDecorator(buttonHost)
  .add("Basic", () => (
    <Toolbar ariaLabel="The toolbar label">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Toolbar>
  ));
