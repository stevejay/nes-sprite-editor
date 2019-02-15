import Button from "../Button";
import { storiesOf } from "@storybook/react";
import { noop } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import { FiEdit3 } from "react-icons/fi";
import { ButtonProps } from "..";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const options = ["default", "dark", "primary", "input", "transparent"];

const Spacer = () => <div style={{ display: "inline-block", width: 16 }} />;

storiesOf("Button", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <>
      <Button
        icon={FiEdit3}
        tabIndex={0}
        onClick={noop}
        aria-label="some aria label"
        disabled={boolean("Disabled", false)}
        appearance={
          select("Color", options, "default") as ButtonProps["appearance"]
        }
      />
      <Spacer />
      <Button
        icon={FiEdit3}
        tabIndex={0}
        onClick={noop}
        disabled={boolean("Disabled", false)}
        appearance={
          select("Color", options, "default") as ButtonProps["appearance"]
        }
      >
        Edit
      </Button>
      <Spacer />
      <Button
        tabIndex={0}
        onClick={noop}
        disabled={boolean("Disabled", false)}
        appearance={
          select("Color", options, "default") as ButtonProps["appearance"]
        }
      >
        Edit
      </Button>
      <Spacer />
      <Button
        type="submit"
        tabIndex={0}
        onClick={noop}
        disabled={boolean("Disabled", false)}
        appearance={
          select("Color", options, "default") as ButtonProps["appearance"]
        }
      >
        Submit
      </Button>
    </>
  ));
