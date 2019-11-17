import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import DropdownMenu from "../DropdownMenu";
import { range } from "lodash";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent",
  width: 300
});

const options = range(0, 4).map(id => ({
  id: `${id}`,
  label: `Some option #${id}`
}));

storiesOf("DropdownMenu", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <DropdownMenu
      options={options}
      disabled={boolean("Disabled", false)}
      onMenuItemSelected={(id: string) => console.log(id)}
    />
  ));
