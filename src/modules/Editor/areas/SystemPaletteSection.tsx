import React from "react";
import { connect } from "react-redux";
import { Label } from "../../../shared/Form";
import Section from "../../../shared/Section";
import SelectInput from "../../../shared/SelectInput";
import useId from "../../../shared/utils/use-id";
import { SystemPalette } from "../store";
import {
  Action,
  EditorStateSlice,
  selectCurrentSystemPalette,
  selectSystemPalettes,
  setSystemPalette
} from "../store";

type Props = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPalette: SystemPalette;
  setSystemPalette: (id: string) => Action;
};

const SystemPaletteSection = ({
  systemPalettes,
  currentSystemPalette
}: Props) => {
  const id = useId();
  return (
    <Section>
      <header>
        <h2>System Palette</h2>
      </header>
      <Label forId={id} label="System palette to use:" />
      <SelectInput<string>
        id={id}
        options={systemPalettes}
        value={currentSystemPalette.id}
        onChange={setSystemPalette}
      />
    </Section>
  );
};

export default connect(
  (state: EditorStateSlice) => ({
    systemPalettes: selectSystemPalettes(state),
    currentSystemPalette: selectCurrentSystemPalette(state)
  }),
  {
    setSystemPalette
  }
)(SystemPaletteSection);
