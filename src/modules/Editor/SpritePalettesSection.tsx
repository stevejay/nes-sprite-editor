import React from "react";
import PaletteCollection from "./PaletteCollection";
import Section from "./Section";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";
import { connect } from "react-redux";
import {
  EditorStateSlice,
  selectCurrentSystemPalette,
  selectSpritePaletteCollections,
  selectCurrentSpritePalettes,
  setPaletteCollection,
  addNewSpritePaletteCollection,
  copyPaletteCollection,
  deletePaletteCollection,
  renamePaletteCollection,
  changePaletteColor,
  Action
} from "./redux";
import {
  GamePaletteCollectionWithColors,
  SystemPalette,
  GamePaletteCollection,
  Color
} from "../../types";

type Props = {
  currentSystemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  setPaletteCollection: (id: string) => Action;
  addNewSpritePaletteCollection: () => Action;
  copyPaletteCollection: (id: string) => Action;
  deletePaletteCollection: (id: string) => Action;
  renamePaletteCollection: (id: string, label: string) => Action;
  changePaletteColor: (
    id: string,
    gamePaletteIndex: number,
    valueIndex: number,
    newColor: Color
  ) => Action;
};

const SpritePalettesSection = ({
  currentSystemPalette,
  paletteCollections,
  currentCollection,
  setPaletteCollection,
  addNewSpritePaletteCollection,
  copyPaletteCollection,
  deletePaletteCollection,
  renamePaletteCollection,
  changePaletteColor
}: Props) => (
  <Section>
    <header>
      <h2>Background Palettes</h2>
    </header>
    <h3>Current Collection</h3>
    <EntityManagementToolbar
      entities={paletteCollections}
      currentEntity={currentCollection}
      entityName="Sprite Palette"
      onSelected={setPaletteCollection}
      onNewEntity={addNewSpritePaletteCollection}
      onCopyEntity={copyPaletteCollection}
      onDeleteEntity={deletePaletteCollection}
      onRenameEntity={renamePaletteCollection}
    />
    <h3>Collection Palettes</h3>
    <PaletteCollection
      type="sprite"
      systemPalette={currentSystemPalette}
      currentCollection={currentCollection}
      onChangePaletteColor={changePaletteColor}
    />
  </Section>
);

export default connect(
  (state: EditorStateSlice) => ({
    currentSystemPalette: selectCurrentSystemPalette(state),
    paletteCollections: selectSpritePaletteCollections(state),
    currentCollection: selectCurrentSpritePalettes(state)
  }),
  {
    setPaletteCollection,
    addNewSpritePaletteCollection,
    copyPaletteCollection,
    deletePaletteCollection,
    renamePaletteCollection,
    changePaletteColor
  }
)(SpritePalettesSection);
