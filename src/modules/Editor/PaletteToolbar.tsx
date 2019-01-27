import React from "react";
import { RovingTabIndexProvider } from "../../shared/RovingTabIndex";
import Panel from "../../shared/Panel";

type Props = {
  ariaLabel: string;
  children: React.ReactNode;
};

const PaletteToolbar: React.FunctionComponent<Props> = ({
  ariaLabel,
  children
}) => (
  <Panel ariaLabel={ariaLabel} ariaOrientation="horizontal" role="toolbar">
    <RovingTabIndexProvider>{children}</RovingTabIndexProvider>
  </Panel>
);

export default PaletteToolbar;
