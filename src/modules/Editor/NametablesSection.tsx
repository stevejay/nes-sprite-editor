import React from "react";
import { Action, GamePaletteCollectionWithColors } from "../../reducer";
import { Nametable as NametableType, PatternTable } from "../../types";
import Section from "./Section";
import NametableSelector from "./NametableSelector";
import NametableToolbar from "./NametableToolbar";
import Nametable from "./Nametable";

type Props = {
  // systemPalette: SystemPalette;
  nametables: Array<NametableType>;
  currentNametable: NametableType | null;
  currentPatternTable: PatternTable | null;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const NametablesSection = ({
  // systemPalette,
  nametables,
  currentNametable,
  currentPatternTable,
  currentPaletteCollection,
  dispatch
}: Props) => (
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
    {/* <PaletteCollection
      type="background"
      systemPalette={systemPalette}
      currentCollection={currentCollection}
      dispatch={dispatch}
    /> */}
  </Section>
);

export default NametablesSection;
