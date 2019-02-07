import React from "react";
import BackgroundPalettesSection from "./BackgroundPalettesSection";
import BackgroundPatternTablesSection from "./BackgroundPatternTablesSection";
import styles from "./Editor.module.scss";
import NametablesSection from "./NametablesSection";
import SpritePalettesSection from "./SpritePalettesSection";
import SystemPaletteSection from "./SystemPaletteSection";

const Editor = () => (
  <>
    <div className={styles.container}>
      <SystemPaletteSection />
      <BackgroundPalettesSection />
      <SpritePalettesSection />
    </div>
    <div className={styles.container}>
      <BackgroundPatternTablesSection />
      <NametablesSection />
    </div>
  </>
);

export default Editor;
