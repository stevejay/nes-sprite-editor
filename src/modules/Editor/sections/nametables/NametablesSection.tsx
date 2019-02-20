import React from "react";
import { connect } from "react-redux";
import Section from "../../../../shared/Section";
import EntityManagementToolbar from "../../components/EntityManagementToolbar";
import Nametable from "../../components/Nametable";
import {
  Action,
  addNewNametable,
  changeNametablePaletteIndex,
  changeNametableTileIndex,
  changePatternTablePixels,
  copyNametable,
  deleteNametable,
  EditorStateSlice,
  GamePaletteCollectionWithColors,
  Nametable as NametableType,
  PatternTable,
  renameNametable,
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable,
  selectNametables,
  setNametable
} from "../../store";

type Props = {
  nametables: Array<NametableType>;
  currentNametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  setNametable: (id: string) => Action;
  addNewNametable: () => Action;
  copyNametable: (id: string) => Action;
  deleteNametable: (id: string) => Action;
  renameNametable: (id: string, label: string) => Action;
  changePatternTablePixels: typeof changePatternTablePixels;
  changeNametablePaletteIndex: typeof changeNametablePaletteIndex;
  changeNametableTileIndex: typeof changeNametableTileIndex;
};

const NametablesSection = ({
  nametables,
  currentNametable,
  patternTable,
  paletteCollection,
  setNametable,
  addNewNametable,
  copyNametable,
  deleteNametable,
  renameNametable,
  changePatternTablePixels,
  changeNametablePaletteIndex,
  changeNametableTileIndex
}: Props) => (
  <Section>
    <header>
      <h2>Nametables</h2>
    </header>
    <h3>Current Nametable</h3>
    <EntityManagementToolbar
      entities={nametables}
      currentEntity={currentNametable}
      entityName="Nametable"
      onSelected={setNametable}
      onNewEntity={addNewNametable}
      onCopyEntity={copyNametable}
      onDeleteEntity={deleteNametable}
      onRenameEntity={renameNametable}
    />
    <h3>Nametable</h3>
    <Nametable
      nametable={currentNametable}
      patternTable={patternTable}
      paletteCollection={paletteCollection}
      onChangePatternTable={changePatternTablePixels}
      onChangePalette={changeNametablePaletteIndex}
      onChangeTile={changeNametableTileIndex}
    />
  </Section>
);

export default connect(
  (state: EditorStateSlice) => ({
    nametables: selectNametables(state),
    currentNametable: selectCurrentNametable(state),
    patternTable: selectCurrentBackgroundPatternTable(state),
    paletteCollection: selectCurrentBackgroundPaletteCollection(state)
  }),
  {
    setNametable,
    addNewNametable,
    copyNametable,
    deleteNametable,
    renameNametable,
    changePatternTablePixels,
    changeNametablePaletteIndex,
    changeNametableTileIndex
  }
)(NametablesSection);
