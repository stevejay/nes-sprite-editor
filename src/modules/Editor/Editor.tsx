import React from "react";
import styles from "./Editor.module.scss";
import EditorSidebar from "./EditorSidebar";
import {
  Action,
  ActionTypes,
  selectBackgroundColor,
  selectBackgroundPalettes,
  selectSpritePalettes,
  selectSystemPalette,
  selectSystemPalettes,
  State,
  selectCurrentBackgroundTileGrid,
  selectBackgroundTileGridScaling
} from "../../reducer";
import BackgroundTileGrid from "./BackgroundTileGrid";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FunctionComponent<Props> = ({ state, dispatch }) => (
  <div className={styles.container}>
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
    <div className={styles.editorMain}>
      <BackgroundTileGrid
        backgroundTileGrid={selectCurrentBackgroundTileGrid(state)}
        backgroundPalettes={selectBackgroundPalettes(state)}
        gridScaling={selectBackgroundTileGridScaling(state)}
      />
    </div>
  </div>
);

export default Editor;
