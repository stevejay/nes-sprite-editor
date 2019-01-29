import React from "react";
// import styles from "./SpritePalettesSection.module.scss";
import Section from "./Section";
import { GamePaletteCollection, SystemPalette } from "../../types";
import { GamePaletteCollectionWithColors, Action } from "../../reducer";

type Props = {
  systemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const SpritePalettesSection: React.FunctionComponent<Props> = () => (
  <Section>
    <header>
      <h1>Sprite Palettes</h1>
    </header>
  </Section>
);

export default SpritePalettesSection;
