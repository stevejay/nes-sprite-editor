import React from "react";
import styles from "./App.module.scss";
import DataOutput from "./modules/DataOutput";
import SkipLink from "./shared/SkipLink";
import { EditorContextProvider } from "./contexts/editor";
import {
  SystemPaletteSection,
  BackgroundPalettesSection,
  SpritePalettesSection,
  BackgroundPatternTablesSection,
  NametablesSection
} from "./modules/Editor";

const App: React.FunctionComponent = () => (
  <EditorContextProvider>
    <SkipLink href="#main">Skip to main content</SkipLink>
    <header className={styles.header}>
      <h1>NES Asset Editor</h1>
    </header>
    <main id="main" className={styles.main}>
      <div className={styles.row}>
        <div className={styles.column}>
          <BackgroundPalettesSection />
          <SpritePalettesSection />
          <SystemPaletteSection />
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            <div className={styles.column}>
              <NametablesSection />
            </div>
            <div className={styles.column}>
              <BackgroundPatternTablesSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  </EditorContextProvider>
);

export default App;
