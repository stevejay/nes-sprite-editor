import React from "react";
import { RovingTabIndexProvider } from "../../shared/RovingTabIndex";
import Panel from "../../shared/Panel";

type Props = {
  children: React.ReactNode;
};

const PaletteToolbar: React.FunctionComponent<Props> = ({ children }) => (
  <Panel ariaLabel="Color toolbar" ariaOrientation="horizontal" role="toolbar">
    <RovingTabIndexProvider>{children}</RovingTabIndexProvider>
  </Panel>
);

export default PaletteToolbar;
