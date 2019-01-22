import { noop } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
// import { withKnobs, boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import Toolbar from "..";
import "../../../index.scss";

const buttonHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("Toolbar", module)
  .addDecorator(buttonHost)
  // .addDecorator(withKnobs)
  .add("Basic", () => (
    <Toolbar ariaLabel="The toolbar label">
      <button onClick={noop}>One</button>
      <button onClick={noop}>Two</button>
      <button onClick={noop}>Three</button>
    </Toolbar>
  ));
