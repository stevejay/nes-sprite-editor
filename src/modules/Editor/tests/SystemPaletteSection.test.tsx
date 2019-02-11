import React from "react";
import { render, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import SystemPaletteSection from "../SystemPaletteSection";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { State } from "../redux";
import { SYSTEM_PALETTE_OPTIONS } from "../../../constants";
import rootReducer from "../../../root-reducer";

const initialState: State = {
  nametables: [],
  selectedNametableId: null,
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  selectedSystemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  paletteCollections: [],
  selectedPaletteCollectionIds: { background: null, sprite: null },
  patternTables: [],
  selectedPatternTableIds: { background: null, sprite: null }
};

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

afterEach(cleanup);

test("displays system palette section", async () => {
  const { container } = renderComponent({});
  expect(container.querySelector("h2")).toHaveTextContent("System Palette");
});

// access via accessibility
