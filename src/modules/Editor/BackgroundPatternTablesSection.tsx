import React from "react";
import { Action, GamePaletteCollectionWithColors } from "../../reducer";
import {
  GamePaletteCollection,
  SystemPalette,
  PatternTable
} from "../../types";
import PaletteCollection from "./PaletteCollection";
import PaletteCollectionSelector from "./PaletteCollectionSelector";
import PaletteCollectionToolbar from "./PaletteCollectionToolbar";
import Section from "./Section";
import PatternTableSelector from "./PatternTableSelector";
import PatternTableToolbar from "./PatternTableToolbar";
import BackgroundPatternTable from "./BackgroundPatternTable";

type Props = {
  patternTables: Array<PatternTable>;
  currentTable: PatternTable | null;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const BackgroundPatternTablesSection = ({
  patternTables,
  currentTable,
  currentPaletteCollection,
  dispatch
}: Props) => {
  const [currentTile, setCurrentTile] = React.useState({ row: 0, column: 0 });
  return (
    <Section>
      <header>
        <h1>Background Pattern Tables</h1>
      </header>
      <h2>Current Pattern Table</h2>
      <PatternTableSelector
        type="background"
        patternTables={patternTables}
        currentTable={currentTable}
        dispatch={dispatch}
      />
      <PatternTableToolbar
        type="background"
        patternTables={patternTables}
        currentTable={currentTable}
        dispatch={dispatch}
      />
      <h2>Pattern Table Tiles</h2>
      <BackgroundPatternTable
        scale={3}
        patternTable={currentTable}
        paletteCollection={currentPaletteCollection}
        currentTile={currentTile}
        onSelectTile={(row, column) => setCurrentTile({ row, column })}
      />
    </Section>
  );
};

export default BackgroundPatternTablesSection;
