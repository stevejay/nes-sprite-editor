import deepFreeze from "@ef-carbon/deep-freeze";
import { reducer, State, ActionTypes } from "./reducer";
import { SYSTEM_PALETTE_OPTIONS } from "./constants";

const DEFAULT_STATE = deepFreeze({
  systemPalettes: [{ ...SYSTEM_PALETTE_OPTIONS[0], id: "p1" }],
  currentSystemPaletteId: "p1",
  paletteCollections: {
    background: {
      collections: [],
      currentCollectionId: null
    },
    sprite: {
      collections: [],
      currentCollectionId: null
    }
  },
  patternTables: {
    background: {
      tables: [],
      currentTableId: null
    },
    sprite: {
      tables: [],
      currentTableId: null
    }
  },
  nametables: [],
  currentNametableId: null
});

describe("reducer", () => {
  it("should handle a SELECT_SYSTEM_PALETTE action", () => {
    const state: State = deepFreeze({
      ...DEFAULT_STATE,
      systemPalettes: [
        { ...SYSTEM_PALETTE_OPTIONS[0], id: "p1" },
        { ...SYSTEM_PALETTE_OPTIONS[0], id: "p2" }
      ],
      currentSystemPaletteId: "p1"
    });

    const newState = reducer(state, {
      type: ActionTypes.SELECT_SYSTEM_PALETTE,
      payload: { id: "p2" }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      systemPalettes: [
        { ...SYSTEM_PALETTE_OPTIONS[0], id: "p1" },
        { ...SYSTEM_PALETTE_OPTIONS[0], id: "p2" }
      ],
      currentSystemPaletteId: "p2"
    });
  });
});
