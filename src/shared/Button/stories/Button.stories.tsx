import Button from "..";
import { storiesOf } from "@storybook/react";
import { noop } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("Button", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <Button tabIndex={0} onClick={noop}>
      Some text
    </Button>
  ));
