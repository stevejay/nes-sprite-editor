import React from "react";
import { Action, ActionTypes } from "../../reducer";
import RadioInput from "../../shared/RadioInput";
import { SystemPalette } from "../../types";
import Section from "./Section";

type Props = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPalette: SystemPalette;
  dispatch: React.Dispatch<Action>;
};

const SystemPaletteSection = ({
  systemPalettes,
  currentSystemPalette,
  dispatch
}: Props) => (
  <Section>
    <header>
      <h1>System Palette</h1>
    </header>
    <RadioInput.Group
      legend="Current system palette:"
      options={systemPalettes}
      selectedId={currentSystemPalette.id}
      onChange={id =>
        dispatch({
          type: ActionTypes.SELECT_SYSTEM_PALETTE,
          payload: { id }
        })
      }
    />
  </Section>
);

export default React.memo(SystemPaletteSection);
