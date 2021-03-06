import React from "react";
import { connect } from "react-redux";
import Section from "../../../shared/Section";
import PatternTable from "../components/PatternTable";
import PatternTableTileDetail from "../components/PatternTableTileDetail";
import {
  addNewBackgroundPatternTable,
  changePatternTableTileLock,
  copyPatternTable,
  deletePatternTable,
  EditorStateSlice,
  renamePatternTable,
  selectBackgroundPatternTables,
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable,
  setPatternTable,
  GamePaletteCollectionWithColors,
  Nametable,
  PatternTable as PatternTableType,
  selectSelectedPatternTableTileIndex,
  updateSelectedPatternTableTileIndex
} from "../store";
import EntitySelectionToolbar from "../components/EntitySelectionToolbar";

type Props = {
  patternTables: Array<PatternTableType>;
  currentPatternTable: PatternTableType | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  currentNametable: Nametable | null;
  tileIndex: number;
  setPatternTable: typeof setPatternTable;
  addNewBackgroundPatternTable: typeof addNewBackgroundPatternTable;
  copyPatternTable: typeof copyPatternTable;
  deletePatternTable: typeof deletePatternTable;
  renamePatternTable: typeof renamePatternTable;
  changePatternTableTileLock: typeof changePatternTableTileLock;
  updateSelectedPatternTableTileIndex: typeof updateSelectedPatternTableTileIndex;
};

const BackgroundPatternTablesSection = ({
  patternTables,
  currentPatternTable,
  paletteCollection,
  currentNametable,
  tileIndex,
  setPatternTable,
  addNewBackgroundPatternTable,
  copyPatternTable,
  deletePatternTable,
  renamePatternTable,
  changePatternTableTileLock,
  updateSelectedPatternTableTileIndex
}: Props) => {
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const palette = paletteCollection
    ? paletteCollection.gamePalettes[paletteIndex]
    : null;
  return (
    <Section>
      <header>
        <h2>Background Pattern Tables</h2>
      </header>
      <h3>Current Pattern Table</h3>
      <EntitySelectionToolbar
        entities={patternTables}
        currentEntity={currentPatternTable}
        entityName="Pattern Table"
        onSelected={setPatternTable}
        onNewEntity={addNewBackgroundPatternTable}
        onCopyEntity={copyPatternTable}
        onDeleteEntity={deletePatternTable}
        onRenameEntity={renamePatternTable}
      />
      {currentPatternTable && palette && paletteCollection && (
        <>
          <h3>Pattern Table</h3>
          <PatternTable
            scale={3}
            patternTable={currentPatternTable}
            paletteCollection={paletteCollection}
            paletteIndex={paletteIndex}
            palette={palette}
            tileIndex={tileIndex}
            onTileSelected={updateSelectedPatternTableTileIndex}
            onPaletteSelected={setPaletteIndex}
          />
          <PatternTableTileDetail
            scale={12}
            tileIndex={tileIndex}
            currentPatternTable={currentPatternTable}
            currentNametable={currentNametable}
            palette={palette}
            onUpdateLocked={isLocked => {
              changePatternTableTileLock(
                currentPatternTable.id,
                tileIndex,
                isLocked
              );
            }}
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
    paletteCollection: selectCurrentBackgroundPaletteCollection(state),
    currentNametable: selectCurrentNametable(state),
    tileIndex: selectSelectedPatternTableTileIndex(state)
  }),
  {
    setPatternTable,
    addNewBackgroundPatternTable,
    copyPatternTable,
    deletePatternTable,
    renamePatternTable,
    changePatternTableTileLock,
    updateSelectedPatternTableTileIndex
  }
)(
  React.memo(
    BackgroundPatternTablesSection,
    (prevProps, nextProps) =>
      prevProps.patternTables === nextProps.patternTables &&
      prevProps.currentPatternTable === nextProps.currentPatternTable &&
      prevProps.paletteCollection === nextProps.paletteCollection &&
      prevProps.currentNametable === nextProps.currentNametable &&
      prevProps.tileIndex === nextProps.tileIndex
  )
);
