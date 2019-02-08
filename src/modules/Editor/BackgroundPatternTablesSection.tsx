import React from "react";
import PatternTable from "./PatternTable";
import Section from "./Section";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";
import { connect } from "react-redux";
import {
  selectBackgroundPatternTables,
  selectCurrentBackgroundPatternTable,
  selectCurrentBackgroundPalettes,
  EditorStateSlice,
  Action,
  setPatternTable,
  addNewBackgroundPatternTable,
  copyPatternTable,
  deletePatternTable,
  renamePatternTable
} from "./redux";
import {
  PatternTable as PatternTableType,
  GamePaletteCollectionWithColors
} from "../../types";

type Props = {
  patternTables: Array<PatternTableType>;
  currentPatternTable: PatternTableType | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  setPatternTable: (id: string) => Action;
  addNewBackgroundPatternTable: () => Action;
  copyPatternTable: (id: string) => Action;
  deletePatternTable: (id: string) => Action;
  renamePatternTable: (id: string, label: string) => Action;
};

const BackgroundPatternTablesSection = ({
  patternTables,
  currentPatternTable,
  paletteCollection,
  setPatternTable,
  addNewBackgroundPatternTable,
  copyPatternTable,
  deletePatternTable,
  renamePatternTable
}: Props) => {
  // TODO move down into PatternTable?
  const [currentTile, setCurrentTile] = React.useState({ row: 0, column: 0 });
  return (
    <Section>
      <header>
        <h2>Background Pattern Tables</h2>
      </header>
      <h3>Current Pattern Table</h3>
      <EntityManagementToolbar
        entities={patternTables}
        currentEntity={currentPatternTable}
        entityName="Pattern Table"
        onSelected={setPatternTable}
        onNewEntity={addNewBackgroundPatternTable}
        onCopyEntity={copyPatternTable}
        onDeleteEntity={deletePatternTable}
        onRenameEntity={renamePatternTable}
      />
      <h3>Pattern Table Tiles</h3>
      <PatternTable
        scale={3}
        patternTable={currentPatternTable}
        paletteCollection={paletteCollection}
        currentTile={currentTile}
        onSelectTile={(row, column) => setCurrentTile({ row, column })}
      />
    </Section>
  );
};

export default connect(
  (state: EditorStateSlice) => ({
    patternTables: selectBackgroundPatternTables(state),
    currentPatternTable: selectCurrentBackgroundPatternTable(state),
    paletteCollection: selectCurrentBackgroundPalettes(state)
  }),
  {
    setPatternTable,
    addNewBackgroundPatternTable,
    copyPatternTable,
    deletePatternTable,
    renamePatternTable
  }
)(BackgroundPatternTablesSection);
