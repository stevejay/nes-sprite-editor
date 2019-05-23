import React from "react";
import { connect } from "react-redux";
import { SelectField } from "../../../../shared/Form";
import Section from "../../../../shared/Section";
import {
  SystemPalette,
  EditorStateSlice,
  selectCurrentSystemPalette,
  selectSystemPalettes,
  setSystemPalette
} from "../../store";

type Props = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPalette: SystemPalette;
  setSystemPalette: typeof setSystemPalette;
};

const SystemPaletteSection = ({
  systemPalettes,
  currentSystemPalette
}: Props) => (
  <Section>
    <header>
      <h2>System Palette</h2>
    </header>
    <SelectField<string>
      label="System palette to use:"
      options={systemPalettes}
      value={currentSystemPalette.id}
      onChange={setSystemPalette}
    />
  </Section>
);

export default connect(
  (state: EditorStateSlice) => ({
    systemPalettes: selectSystemPalettes(state),
    currentSystemPalette: selectCurrentSystemPalette(state)
  }),
  {
    setSystemPalette
  }
)(
  React.memo(
    SystemPaletteSection,
    (prevProps, nextProps) =>
      prevProps.currentSystemPalette === nextProps.currentSystemPalette
  )
);
