import React from "react";
import { render } from "@testing-library/react";
import SystemPaletteSection from "../SystemPaletteSection";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { State, reducer, EditorStateSlice } from "../../store";
import { SYSTEM_PALETTE_OPTIONS } from "../../constants";

const initialState: State = {
  nametables: [],
  selectedNametableId: null,
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  selectedSystemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  paletteCollections: [],
  selectedPaletteCollectionIds: { background: null, sprite: null },
  patternTables: [],
  selectedPatternTableIds: { background: null, sprite: null },
  selectedPatternTableTileIndex: 0
};

const rootReducer = combineReducers<EditorStateSlice>({
  editor: reducer
});

const renderComponent = (mergeState: Partial<State>) =>
  render(
    <Provider
      store={createStore(rootReducer, {
        editor: { ...initialState, ...mergeState }
      })}
    >
      <SystemPaletteSection />
    </Provider>
  );

test("displays the system palette section", async () => {
  const { container, getByLabelText } = renderComponent({});
  expect(container.querySelector("h2")).toHaveTextContent("System Palette");
  expect(getByLabelText("System palette to use:")).toBeTruthy();
});
