import React from "react";
import {
  selectCurrentBackgroundPaletteCollection,
  selectCurrentSpritePaletteCollection,
  State,
  selectCurrentBackgroundPatternTable
} from "../../reducer";
import CodePanel from "./CodePanel";
import createGameDataText from "./create-game-data-text";
import Button from "../../shared/Button";
import downloadPatternTable from "./download-pattern-table";

type Props = {
  state: State;
};

const GameDataOutput: React.FunctionComponent<Props> = ({ state }) => {
  const backgroundPaletteCollection = selectCurrentBackgroundPaletteCollection(
    state
  );
  const spritePaletteCollection = selectCurrentSpritePaletteCollection(state);
  const backgroundPatternTable = selectCurrentBackgroundPatternTable(state);
  const [dataVersion, setDataVersion] = React.useState(0);

  const gameDataText = React.useMemo(
    () =>
      createGameDataText(backgroundPaletteCollection, spritePaletteCollection),
    [dataVersion]
  );

  return (
    <section>
      <header>
        <h1>ASM Output</h1>
      </header>
      <Button.Container>
        <Button onClick={() => setDataVersion(Date.now())}>
          Update text output
        </Button>
        <Button
          disabled={!backgroundPatternTable}
          onClick={() =>
            backgroundPatternTable &&
            downloadPatternTable(backgroundPatternTable)
          }
        >
          Download background tiles pattern file
        </Button>
      </Button.Container>
      <CodePanel>{gameDataText}</CodePanel>
    </section>
  );
};

export default GameDataOutput;
