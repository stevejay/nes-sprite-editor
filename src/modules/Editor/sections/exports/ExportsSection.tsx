import React from "react";
import { connect } from "react-redux";
import Button from "../../../../shared/Button";
import Section from "../../../../shared/Section";
import {
  EditorStateSlice,
  exportStateForNES,
  GamePaletteCollectionWithColors,
  Nametable as NametableType,
  PatternTable,
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable
} from "../../store";

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  exportStateForNES: any; // typeof exportStateForNES;
};

const ExportsSection = ({
  nametable,
  patternTable,
  paletteCollection,
  exportStateForNES
}: Props) => {
  const cannotExport = !nametable || !patternTable || !paletteCollection;
  return (
    <Section>
      <header>
        <h2>Exports</h2>
      </header>
      <Button
        appearance="primary"
        onClick={() => exportStateForNES()}
        disabled={cannotExport}
      >
        Export current state as NES files
      </Button>
    </Section>
  );
};

export default connect(
  (state: EditorStateSlice) => ({
    nametable: selectCurrentNametable(state),
    patternTable: selectCurrentBackgroundPatternTable(state),
    paletteCollection: selectCurrentBackgroundPaletteCollection(state)
  }),
  {
    exportStateForNES
  }
)(ExportsSection);
