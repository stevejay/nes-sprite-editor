import React from "react";
import RadioInput from "../../shared/RadioInput";
import Section from "./Section";
import { connect } from "react-redux";
import {
  selectSystemPalettes,
  EditorStateSlice,
  setSystemPalette,
  selectCurrentSystemPalette,
  Action
} from "./redux";
import { SystemPalette } from "../../types";

type Props = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPalette: SystemPalette;
  setSystemPalette: (id: string) => Action;
};

const SystemPaletteSection = ({
  systemPalettes,
  currentSystemPalette
}: Props) => (
  <Section>
    <header>
      <h2>System Palette</h2>
    </header>
    <RadioInput.Group
      legend="Current system palette:"
      options={systemPalettes}
      selectedId={currentSystemPalette.id}
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
)(SystemPaletteSection);
