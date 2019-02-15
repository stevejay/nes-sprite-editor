import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../../index.scss";
import Container from "../Container";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("PaletteColorInput/Container", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <Container>
      <p style={{ padding: "15px", margin: 0 }}>This is some content</p>
    </Container>
  ));
