import React from "react";
import PatternTable from "../PatternTable";
import Section from "../../../shared/Section";
import EntityManagementToolbar from "../EntityManagementToolbar";
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
  renamePatternTable,
  selectCurrentNametable
} from "../store";
import {
  PatternTable as PatternTableType,
  GamePaletteCollectionWithColors,
  Nametable
} from "../store";
import RadioInput from "../../../shared/RadioInput";
import PatternTileDetail from "../PatternTileDetail";
import { filter } from "lodash";

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

  const tileUsageCount = React.useMemo<number>(
    () =>
      currentNametable
        ? filter(currentNametable.tileIndexes, x => x === tileIndex).length
        : 0,
    [currentNametable, tileIndex]
  );

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
            tile={currentPatternTable.tiles[tileIndex]}
            tileUsageCount={tileUsageCount}
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
)(BackgroundPatternTablesSection);
