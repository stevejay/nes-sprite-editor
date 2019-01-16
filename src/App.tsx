import React from "react";
import EditorSidebar from "./EditorSidebar";
import {
  State,
  Action,
  reducer,
  initialState,
  selectBackgroundPalettes,
  selectSpritePalettes,
  selectSystemPalette,
  selectBackgroundColor,
  ActionTypes,
  selectSystemPalettes
} from "./reducer";
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
      <main className={styles.main}>
        <div className={styles.editorContainer} />
        <EditorSidebar
          systemPalettes={selectSystemPalettes(state)}
          systemPalette={selectSystemPalette(state)}
          onSystemPaletteChange={id =>
            dispatch({
              type: ActionTypes.CHANGE_SYSTEM_PALETTE,
              payload: id
            })
          }
          backgroundColor={selectBackgroundColor(state)}
          onBackgroundColorChange={color =>
            dispatch({
              type: ActionTypes.CHANGE_BACKGROUND_COLOR,
              payload: color.id
            })
          }
          backgroundPalettes={selectBackgroundPalettes(state)}
          spritePalettes={selectSpritePalettes(state)}
          onGamePaletteChange={gamePaletteChange =>
            dispatch({
              type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
              payload: gamePaletteChange
            })
          }
        />
      </main>
    </>
  );
};

export default App;
