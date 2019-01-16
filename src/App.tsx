import React from "react";
import { State, Action, reducer, initialState } from "./reducer";
import Editor from "./Editor";
import styles from "./App.module.scss";

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
      <Editor state={state} dispatch={dispatch} />
    </>
  );
};

export default App;
