import { filter } from "lodash";
import React from "react";
import { connect } from "react-redux";
import RadioInput from "../../../../shared/RadioInput";
import Section from "../../../../shared/Section";
import EntityManagementToolbar from "../../EntityManagementToolbar";
import PatternTable from "../../PatternTable";
import PatternTileDetail from "../../PatternTileDetail";
import {
  addNewBackgroundPatternTable,
  copyPatternTable,
  deletePatternTable,
  EditorStateSlice,
  renamePatternTable,
  selectBackgroundPatternTables,
  selectCurrentBackgroundPalettes,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable,
  setPatternTable
} from "../../store";
import {
  GamePaletteCollectionWithColors,
  Nametable,
  PatternTable as PatternTableType
} from "../../store";

const PALETTE_OPTIONS = [
  { id: 0, label: "#0" },
  { id: 1, label: "#1" },
  { id: 2, label: "#2" },
  { id: 3, label: "#3" }
];

type Props = {
  patternTables: Array<PatternTableType>;
  currentPatternTable: PatternTableType | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  currentNametable: Nametable | null;
  setPatternTable: typeof setPatternTable;
  addNewBackgroundPatternTable: typeof addNewBackgroundPatternTable;
  copyPatternTable: typeof copyPatternTable;
  deletePatternTable: typeof deletePatternTable;
  renamePatternTable: typeof renamePatternTable;
};

const BackgroundPatternTablesSection = ({
  patternTables,
  currentPatternTable,
  paletteCollection,
  currentNametable,
  setPatternTable,
  addNewBackgroundPatternTable,
  copyPatternTable,
  deletePatternTable,
  renamePatternTable
}: Props) => {
  const [tileIndex, setTileIndex] = React.useState(0);
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const selectedPalette = paletteCollection
    ? paletteCollection.gamePalettes[paletteIndex]
    : null;

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
      {currentPatternTable && selectedPalette && (
        <>
          <h3>Pattern Table Tiles</h3>
          <RadioInput.Group<number>
            legend="Background palette for preview:"
            options={PALETTE_OPTIONS}
            selectedId={paletteIndex}
            onChange={setPaletteIndex}
            inline
          />
          <PatternTable
            scale={3}
            patternTable={currentPatternTable}
            palette={selectedPalette}
            tileIndex={tileIndex}
            onSelectTile={setTileIndex}
          />
          <PatternTileDetail
            scale={12}
            tileIndex={tileIndex}
            currentPatternTable={currentPatternTable}
            currentNametable={currentNametable}
            palette={selectedPalette}
          />
        </>
      )}
    </Section>
  );
};

export default connect(
  (state: EditorStateSlice) => ({
    patternTables: selectBackgroundPatternTables(state),
    currentPatternTable: selectCurrentBackgroundPatternTable(state),
    paletteCollection: selectCurrentBackgroundPalettes(state),
    currentNametable: selectCurrentNametable(state)
  }),
  {
    setPatternTable,
    addNewBackgroundPatternTable,
    copyPatternTable,
    deletePatternTable,
    renamePatternTable
  }
)(
  React.memo(
    BackgroundPatternTablesSection,
    (prevProps, nextProps) =>
      prevProps.patternTables === nextProps.patternTables &&
      prevProps.currentPatternTable === nextProps.currentPatternTable &&
      prevProps.paletteCollection === nextProps.paletteCollection &&
      prevProps.currentNametable === nextProps.currentNametable
  )
);
