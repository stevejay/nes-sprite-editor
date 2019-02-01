import SkipLink from "..";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const FocusedSkipLink = () => {
  const ref = React.useRef<any>(null);
  React.useEffect(() => ref.current.focus());
  return (
    <SkipLink ref={ref} href="#">
      Some text
    </SkipLink>
  );
};

storiesOf("SkipLink", module)
  .addDecorator(storyHost)
  .add("Basic", () => <FocusedSkipLink />);
