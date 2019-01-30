import React from "react";
// import RadioInput from "../../shared/RadioInput";
import { SystemPalette } from "../../types";
import Section from "./Section";
import { uniqueId } from "lodash";
import SelectInput from "../../shared/SelectInput";
import { ActionTypes, Action } from "../../reducer";

type Props = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPalette: SystemPalette;
  dispatch: React.Dispatch<Action>;
};

const SystemPaletteSection: React.FunctionComponent<Props> = ({
  systemPalettes,
  currentSystemPalette,
  dispatch
}) => {
  const selectId = React.useRef(uniqueId("select_"));
  return (
    <Section>
      <header>
        <h1>System Palette</h1>
      </header>
      <label
        htmlFor={selectId.current}
        style={{ marginBottom: "0.5rem", display: "inline-block" }}
      >
        Current system palette:
      </label>
      <SelectInput<string>
        id={selectId.current}
        options={systemPalettes}
        selectedId={currentSystemPalette.id}
        onChange={id =>
          dispatch({
            type: ActionTypes.SELECT_SYSTEM_PALETTE,
            payload: { id }
          })
        }
      />
      {/* <RadioInput.Group
        legend="System palette to use:"
        options={systemPalettes}
        selectedId={currentSystemPalette.id}
        onChange={onChange}
      /> */}
    </Section>
  );
};

export default SystemPaletteSection;
