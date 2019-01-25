import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import { ModalBackdrop, PointingModalContainer } from "..";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

storiesOf("Modal", module)
  .addDecorator(storyHost)
  .add("ModalBackdrop", () => <ModalBackdrop opacity={0.5} />)
  .add("PointingModalContainer", () => (
    <PointingModalContainer originElement={null} originX={50} originY={100}>
      <div>
        Some content
        <br />
        in a modal
      </div>
    </PointingModalContainer>
  ));
