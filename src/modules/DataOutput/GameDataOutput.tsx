import React from "react";
import {
  selectBackgroundColor,
  selectBackgroundPalettes,
  selectSpritePalettes,
  State,
  selectCurrentBackgroundTileGrid
} from "../../reducer";
import CodeContainer from "./CodeContainer";
import createGameDataText from "./create-game-data-text";
import Button from "../../shared/Button";
import downloadTileGrid from "./download-tile-grid";
import Toolbar from "../../shared/Toolbar";

type Props = {
  state: State;
};

const GameDataOutput: React.FunctionComponent<Props> = ({ state }) => {
  const backgroundPalettes = selectBackgroundPalettes(state);
  const spritePalettes = selectSpritePalettes(state);
  const backgroundColor = selectBackgroundColor(state);
  const backgroundTileGrid = selectCurrentBackgroundTileGrid(state);
  const [dataVersion, setDataVersion] = React.useState(0);

  const gameDataText = React.useMemo(
    () =>
      createGameDataText(
        backgroundColor,
        backgroundPalettes,
        spritePalettes,
        backgroundTileGrid
      ),
    [dataVersion]
  );

  return (
    <section>
      <header>
        <h1>ASM Output</h1>
      </header>
      <Toolbar>
        <Button onClick={() => setDataVersion(Date.now())}>Update</Button>
        <Button onClick={() => downloadTileGrid(backgroundTileGrid)}>
          Download background tiles pattern file
        </Button>
      </Toolbar>
      <CodeContainer>{gameDataText}</CodeContainer>
    </section>
  );
};

export default GameDataOutput;
