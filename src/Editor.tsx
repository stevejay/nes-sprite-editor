import React from "react";
import {
  State,
  selectBackgroundPalettes,
  selectSpritePalettes,
  selectSystemPalette,
  selectBackgroundColor,
  ActionTypes,
  selectSystemPalettes,
  Action
} from "./reducer";
import EditorSidebar from "./EditorSidebar";
import styles from "./Editor.module.scss";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FunctionComponent<Props> = ({ state, dispatch }) => (
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
);

export default Editor;
