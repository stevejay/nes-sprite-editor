import { noop } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
// import { withKnobs, boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import styles from "./temp.module.scss";
import Toolbar from "..";
import "../../../index.scss";

const buttonHost = host({
  align: "center middle",
  backdrop: "transparent"
});

class Button extends React.Component {
  _ref: HTMLButtonElement | null = null;
  focus = () => {
    this._ref && this._ref.focus();
  };
  render() {
    const { children, ...rest } = this.props;
    return (
      <button
        ref={ref => (this._ref = ref)}
        {...rest}
        className={styles.button}
      >
        {children}
      </button>
    );
  }
}

storiesOf("Toolbar", module)
  .addDecorator(buttonHost)
  .add("Basic", () => (
    <Toolbar ariaLabel="The toolbar label">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Toolbar>
  ));
