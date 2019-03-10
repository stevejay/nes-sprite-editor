import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import TransitionsExample from "./fruits";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

storiesOf("SteelEye/Fruits", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => <TransitionsExample />);
