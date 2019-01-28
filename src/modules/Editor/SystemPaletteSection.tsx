import React from "react";
import RadioInput from "../../shared/RadioInput";
import { SystemPalette } from "../../types";
import Section from "./Section";

type Props = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPalette: SystemPalette;
  onChange: (id: SystemPalette["id"]) => void;
};

const SystemPaletteSection: React.FunctionComponent<Props> = ({
  systemPalettes,
  currentSystemPalette,
  onChange
}) => (
  <Section>
    <header>
      <h1>System Palette</h1>
    </header>
    <RadioInput.Group
      legend="System palette to use:"
      options={systemPalettes}
      selectedId={currentSystemPalette.id}
      onChange={onChange}
    />
  </Section>
);

export default SystemPaletteSection;
