import React from "react";
import { connect } from "react-redux";
import Section from "../../../shared/Section";
import PaletteCollection from "../components/PaletteCollection";
import {
  addNewSpritePaletteCollection,
  changePaletteColor,
  copyPaletteCollection,
  deletePaletteCollection,
  EditorStateSlice,
  GamePaletteCollection,
  GamePaletteCollectionWithColors,
  renamePaletteCollection,
  selectCurrentSpritePaletteCollection,
  selectCurrentSystemPalette,
  selectSpritePaletteCollections,
  setPaletteCollection,
  SystemPalette
} from "../store";
import EntitySelectionToolbar from "../components/EntitySelectionToolbar";

type Props = {
  systemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  setPaletteCollection: typeof setPaletteCollection;
  addNewSpritePaletteCollection: typeof addNewSpritePaletteCollection;
  copyPaletteCollection: typeof copyPaletteCollection;
  deletePaletteCollection: typeof deletePaletteCollection;
  renamePaletteCollection: typeof renamePaletteCollection;
  changePaletteColor: typeof changePaletteColor;
};

const SpritePalettesSection = ({
  systemPalette,
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
      <h2>Sprite Palettes</h2>
    </header>
    <h3>Current Collection</h3>
    <EntitySelectionToolbar
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
      systemPalette={systemPalette}
      currentCollection={currentCollection}
      onChangePaletteColor={changePaletteColor}
    />
  </Section>
);

export default connect(
  (state: EditorStateSlice) => ({
    systemPalette: selectCurrentSystemPalette(state),
    paletteCollections: selectSpritePaletteCollections(state),
    currentCollection: selectCurrentSpritePaletteCollection(state)
  }),
  {
    setPaletteCollection,
    addNewSpritePaletteCollection,
    copyPaletteCollection,
    deletePaletteCollection,
    renamePaletteCollection,
    changePaletteColor
  }
)(
  React.memo(
    SpritePalettesSection,
    (prevProps, nextProps) =>
      prevProps.systemPalette === nextProps.systemPalette &&
      prevProps.paletteCollections === nextProps.paletteCollections &&
      prevProps.currentCollection === nextProps.currentCollection
  )
);
