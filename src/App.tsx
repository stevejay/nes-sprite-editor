import React from "react";
import styles from "./App.module.scss";
import Editor from "./modules/Editor";
import DataOutput from "./modules/DataOutput";
import SkipLink from "./shared/SkipLink";
import { EditorContextProvider } from "./contexts/editor";

const App: React.FunctionComponent = () => (
  <>
    <EditorContextProvider>
      <SkipLink href="#main">Skip to main content</SkipLink>
      <header className={styles.header}>
        <h1>NES Asset Editor</h1>
      </header>
      <main id="main" className={styles.main}>
        <Editor />
        <DataOutput />
      </main>
    </EditorContextProvider>
  </>
);

export default App;
