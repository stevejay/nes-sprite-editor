import React from "react";
import RadioInput from "../../shared/RadioInput";
import Section from "./Section";
import {
  selectSystemPalettes,
  selectCurrentSystemPalette,
  ActionTypes,
  useEditorContext
} from "../../contexts/editor";

const SystemPaletteSection = () => {
  const [state, dispatch] = useEditorContext();
  const systemPalettes = selectSystemPalettes(state);
  const currentSystemPalette = selectCurrentSystemPalette(state);

  return (
    <Section>
      <header>
        <h2>System Palette</h2>
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
};

export default React.memo(SystemPaletteSection);
