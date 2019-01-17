import React from "react";
import {
  selectBackgroundColor,
  selectBackgroundPalettes,
  selectSpritePalettes,
  State
} from "../../reducer";
import CodeContainer from "./CodeContainer";
import createGameDataText from "./create-game-data-text";

type Props = {
  state: State;
};

const GameDataOutput: React.FunctionComponent<Props> = ({ state }) => {
  const backgroundPalettes = selectBackgroundPalettes(state);
  const spritePalettes = selectSpritePalettes(state);
  const backgroundColor = selectBackgroundColor(state);

  const gameDataText = React.useMemo(
    () =>
      createGameDataText(backgroundColor, backgroundPalettes, spritePalettes),
    [backgroundColor, backgroundPalettes, spritePalettes]
  );

  return (
    <section>
      <header>
        <h1>ASM Output</h1>
      </header>
      <CodeContainer>{gameDataText}</CodeContainer>
    </section>
  );
};

export default GameDataOutput;
