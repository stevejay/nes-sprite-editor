import React from "react";
import styles from "./App.module.scss";
import Editor from "./modules/Editor";
import DataOutput from "./modules/DataOutput";
import { Action, initialState, reducer, State } from "./reducer";
import SkipLink from "./shared/SkipLink";

const AppStateContext = React.createContext(initialState);

const AppStateContextProvider = AppStateContext.Provider;

const App: React.FunctionComponent = () => {
  const [state, dispatch] = React.useReducer<State, Action>(
    reducer,
    initialState
  );

  return (
    <>
      <AppStateContextProvider value={initialState}>
        <SkipLink href="#main">Skip to main content</SkipLink>
        <header className={styles.header}>
          <h1>NES Asset Editor</h1>
        </header>
        <main id="main" className={styles.main}>
          <Editor state={state} dispatch={dispatch} />
          <DataOutput state={state} />
        </main>
      </AppStateContextProvider>
    </>
  );
};

export default App;
