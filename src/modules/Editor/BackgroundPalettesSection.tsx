import React from "react";
import { Action, GamePaletteCollectionWithColors } from "../../reducer";
import { GamePaletteCollection, SystemPalette } from "../../types";
import PaletteCollection from "./PaletteCollection";
import PaletteCollectionSelector from "./PaletteCollectionSelector";
import PaletteCollectionToolbar from "./PaletteCollectionToolbar";
import Section from "./Section";

type Props = {
  systemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const BackgroundPalettesSection = ({
  systemPalette,
  paletteCollections,
  currentCollection,
  dispatch
}: Props) => (
  <Section>
    <header>
      <h1>Background Palettes</h1>
    </header>
    <h2>Current Collection</h2>
    <PaletteCollectionSelector
      type="background"
      paletteCollections={paletteCollections}
      currentCollection={currentCollection}
      dispatch={dispatch}
    />
    <PaletteCollectionToolbar
      type="background"
      paletteCollections={paletteCollections}
      currentCollection={currentCollection}
      dispatch={dispatch}
    />
    <h2>Collection Palettes</h2>
    <PaletteCollection
      type="background"
      systemPalette={systemPalette}
      currentCollection={currentCollection}
      dispatch={dispatch}
    />
  </Section>
);

export default BackgroundPalettesSection;
