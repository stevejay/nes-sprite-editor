import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import Panel from "..";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("Panel", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <Panel>
      <p style={{ padding: "15px", margin: 0 }}>This is some content</p>
    </Panel>
  ));
