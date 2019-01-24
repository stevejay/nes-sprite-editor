import * as React from "react";
import { host } from "storybook-host";
import { storiesOf } from "@storybook/react";
import { RovingTabIndexProvider, useRovingTabIndex } from "..";
import "../../../index.scss";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

type Props = {
  index: number;
  children: React.ReactNode;
};

const ToolbarButton: React.FunctionComponent<Props> = ({ index, children }) => {
  const buttonRef = React.useRef(null);
  const [tabIndex, onKeyDown, onClick] = useRovingTabIndex(index, buttonRef);

  return (
    <button
      ref={buttonRef}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

storiesOf("RovingTabIndex", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <RovingTabIndexProvider>
      <ToolbarButton index={0}>First Option</ToolbarButton>
      <ToolbarButton index={1}>Second Option</ToolbarButton>
      <ToolbarButton index={2}>Third Option</ToolbarButton>
    </RovingTabIndexProvider>
  ));
