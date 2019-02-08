import React from "react";
import { connect } from "react-redux";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";
import {
  GamePaletteCollectionWithColors,
  Nametable as NametableType,
  PatternTable
} from "../../types";
import Nametable from "./Nametable";
import {
  Action,
  addNewNametable,
  copyNametable,
  deleteNametable,
  EditorStateSlice,
  renameNametable,
  changePatternTablePixels,
  selectCurrentBackgroundPalettes,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable,
  selectNametables,
  setNametable
} from "./redux";
import Section from "./Section";

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
  changePatternTablePixels: (
    id: string,
    tileIndex: number,
    startPixelIndex: number,
    newPixels: Array<number>
  ) => Action;
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
  changePatternTablePixels
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
    />
  </Section>
);

export default connect(
  (state: EditorStateSlice) => ({
    nametables: selectNametables(state),
    currentNametable: selectCurrentNametable(state),
    patternTable: selectCurrentBackgroundPatternTable(state),
    paletteCollection: selectCurrentBackgroundPalettes(state)
  }),
  {
    setNametable,
    addNewNametable,
    copyNametable,
    deleteNametable,
    renameNametable,
    changePatternTablePixels
  }
)(NametablesSection);
