import React from "react";
import { Action, GamePaletteCollectionWithColors } from "../../reducer";
import { Nametable as NametableType, PatternTable } from "../../types";
import Section from "./Section";
import NametableSelector from "./NametableSelector";
import NametableToolbar from "./NametableToolbar";
import Nametable from "./Nametable";
// import RadioInput from "../../shared/RadioInput";

// -------------------------------

// type ToolData =
//   | {
//       toolType: "palette";
//       toolData: { paletteIndex: number },
//       metatile: { row: number; column: number };
//     }
//   | {
//       toolType: "pencil";
//       toolData: { paletteIndex: number, colorIndex: number },
//       pixel: { row: number; column: number };
//     }
//   | {
//       toolType: "pattern";
//       tile: { row: number; column: number };
//     }
//   | {
//       toolType: "zoom";
//       tileArea: { top: number; left: number; width: number; height: number };
//     };

// -------------------------------

type Props = {
  // systemPalette: SystemPalette;
  nametables: Array<NametableType>;
  currentNametable: NametableType | null;
  currentPatternTable: PatternTable | null;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

// const OPTIONS = [
//   { id: "palette0", label: "Palette #0" },
//   { id: "palette1", label: "Palette #1" },
//   { id: "palette2", label: "Palette #2" },
//   { id: "palette3", label: "Palette #3" }
// ];

const NametablesSection = ({
  // systemPalette,
  nametables,
  currentNametable,
  currentPatternTable,
  currentPaletteCollection,
  dispatch
}: Props) => {
  return (
    <Section>
      <header>
        <h1>Nametables</h1>
      </header>
      <h2>Current Nametable</h2>
      <NametableSelector
        nametables={nametables}
        currentNametable={currentNametable}
        dispatch={dispatch}
      />
      <NametableToolbar
        nametables={nametables}
        currentNametable={currentNametable}
        dispatch={dispatch}
      />
      <h2>Nametable Tiles</h2>
      <Nametable
        nametable={currentNametable}
        patternTable={currentPatternTable}
        paletteCollection={currentPaletteCollection}
      />

      {/* <RadioInput.Group
        legend="Tools"
        options={OPTIONS}
        selectedId={toolId}
        onChange={id => setToolId(id)}
      /> */}

      {/* <PaletteCollection
      type="background"
      systemPalette={systemPalette}
      currentCollection={currentCollection}
      dispatch={dispatch}
    /> */}
    </Section>
  );
};

export default NametablesSection;
