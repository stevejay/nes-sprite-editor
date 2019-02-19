import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import styles from "./App.module.scss";
import {
  BackgroundPalettesSection,
  BackgroundPatternTablesSection,
  ExportsSection,
  NametablesSection,
  SpritePalettesSection,
  SystemPaletteSection
} from "./modules/editor";
import Header from "./modules/header";
import rootReducer from "./root-reducer";
import SkipLink from "./shared/SkipLink";

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => (
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
            <div className={styles.column}>
              <NametablesSection />
            </div>
            <div className={styles.column}>
              <BackgroundPatternTablesSection />
              <ExportsSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  </Provider>
);

export default App;
