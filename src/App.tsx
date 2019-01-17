import React from "react";
import styles from "./App.module.scss";
import Editor from "./modules/Editor";
import DataOutput from "./modules/DataOutput";
import { Action, initialState, reducer, State } from "./reducer";

const App: React.FunctionComponent = () => {
  const [state, dispatch] = React.useReducer<State, Action>(
    reducer,
    initialState
  );

  return (
    <>
      <header className={styles.header}>
        <h1>NES Asset Editor</h1>
      </header>
      <main className={styles.main}>
        <Editor state={state} dispatch={dispatch} />
        <hr className={styles.hr} />
        <DataOutput state={state} />
      </main>
    </>
  );
};

export default App;
