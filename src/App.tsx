import React from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import styles from "./App.module.scss";
import DataOutput from "./modules/data-output";
import SkipLink from "./shared/SkipLink";
import {
  SystemPaletteSection,
  BackgroundPalettesSection,
  SpritePalettesSection,
  BackgroundPatternTablesSection,
  NametablesSection
} from "./modules/editor";
import rootReducer from "./root-reducer";
import Header from "./modules/header";

const store = createStore(rootReducer);

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <SkipLink href="#main">Skip to main content</SkipLink>
    <Header />
    <main id="main" className={styles.main}>
      <div className={styles.row}>
        <div className={styles.column}>
          <BackgroundPalettesSection />
          <SpritePalettesSection />
          <SystemPaletteSection />
        </div>
        <div className={styles.column}>
          <div className={styles.row}>
            {/* <div className={styles.column}>
              <NametablesSection />
            </div> */}
            <div className={styles.column}>
              <BackgroundPatternTablesSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  </Provider>
);

export default App;
