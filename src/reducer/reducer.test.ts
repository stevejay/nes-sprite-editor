import deepFreeze from "@ef-carbon/deep-freeze";
import { reducer } from "./reducer";
import { State, ActionTypes } from "./types";
import { SYSTEM_PALETTE_OPTIONS } from "../constants";
import { range } from "lodash";
import { PatternTable } from "../types";

const BACKGROUND_PALETTE_COLLECTION_0000 = deepFreeze({
  id: "background_palette_coll_0000",
  label: "Label Background 0000",
  gamePalettes: [
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] }
  ]
});

const BACKGROUND_PALETTE_COLLECTION_0001 = deepFreeze({
  id: "background_palette_coll_0001",
  label: "Label Background 0001",
  gamePalettes: [
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] }
  ]
});

const SPRITE_PALETTE_COLLECTION_0000 = deepFreeze({
  id: "sprite_palette_coll_0000",
  label: "Label Sprite 0000",
  gamePalettes: [
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
    { colorIndexes: [0x00, 0x00, 0x00, 0x00] }
  ]
});

const BLANK_PATTERN_TABLE_TILES: PatternTable["tiles"] = deepFreeze(
  range(0, 256).map(() => ({
    pixels: new Uint8Array(64)
  }))
) as PatternTable["tiles"];

const BACKGROUND_PATTERN_TABLE_0000 = deepFreeze({
  id: "background_pattern_table_0000",
  label: "Label Background 0000",
  tiles: BLANK_PATTERN_TABLE_TILES
});

const BACKGROUND_PATTERN_TABLE_0001 = deepFreeze({
  id: "background_pattern_table_0001",
  label: "Label Background 0001",
  tiles: BLANK_PATTERN_TABLE_TILES
});

const SPRITE_PATTERN_TABLE_0000 = deepFreeze({
  id: "sprite_pattern_table_0000",
  label: "Label Background 0000",
  tiles: BLANK_PATTERN_TABLE_TILES
});

const DEFAULT_STATE = deepFreeze({
  systemPalettes: [{ ...SYSTEM_PALETTE_OPTIONS[0], id: "p1" }],
  currentSystemPaletteId: "p1",
  paletteCollections: {
    background: {
      collections: [BACKGROUND_PALETTE_COLLECTION_0000],
      currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id
    },
    sprite: {
      collections: [SPRITE_PALETTE_COLLECTION_0000],
      currentCollectionId: SPRITE_PALETTE_COLLECTION_0000.id
    }
  },
  patternTables: {
    background: {
      tables: [BACKGROUND_PATTERN_TABLE_0000],
      currentTableId: BACKGROUND_PATTERN_TABLE_0000.id
    },
    sprite: {
      tables: [SPRITE_PATTERN_TABLE_0000],
      currentTableId: SPRITE_PATTERN_TABLE_0000.id
    }
  },
  nametables: [],
  currentNametableId: null
});

describe("reducer", () => {
  it("should handle SELECT_SYSTEM_PALETTE action", () => {
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

  it("should handle SELECT_PALETTE_COLLECTION action", () => {
    const state: State = deepFreeze({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            BACKGROUND_PALETTE_COLLECTION_0000,
            BACKGROUND_PALETTE_COLLECTION_0001
          ],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });

    const newState = reducer(state, {
      type: ActionTypes.SELECT_PALETTE_COLLECTION,
      payload: { type: "background", id: BACKGROUND_PALETTE_COLLECTION_0001.id }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            BACKGROUND_PALETTE_COLLECTION_0000,
            BACKGROUND_PALETTE_COLLECTION_0001
          ],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0001.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle ADD_NEW_PALETTE_COLLECTION action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
      payload: { type: "background", label: "New palette collection" }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            BACKGROUND_PALETTE_COLLECTION_0000,
            {
              id: expect.stringMatching(/.+/),
              label: "New palette collection",
              gamePalettes: [
                { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
                { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
                { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
                { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] }
              ]
            }
          ],
          currentCollectionId:
            newState.paletteCollections.background.collections[1].id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle UPDATE_PALETTE_COLLECTION_METADATA action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA,
      payload: {
        type: "background",
        id: BACKGROUND_PALETTE_COLLECTION_0000.id,
        label: "Updated Label"
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            {
              ...BACKGROUND_PALETTE_COLLECTION_0000,
              label: "Updated Label"
            }
          ],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle COPY_PALETTE_COLLECTION action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.COPY_PALETTE_COLLECTION,
      payload: {
        type: "background",
        id: BACKGROUND_PALETTE_COLLECTION_0000.id
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            BACKGROUND_PALETTE_COLLECTION_0000,
            {
              ...BACKGROUND_PALETTE_COLLECTION_0000,
              label: BACKGROUND_PALETTE_COLLECTION_0000.label + " Copy",
              id: expect.stringMatching(/.+/)
            }
          ],
          currentCollectionId:
            newState.paletteCollections.background.collections[1].id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle DELETE_PALETTE_COLLECTION action when there is only one collection", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.DELETE_PALETTE_COLLECTION,
      payload: {
        type: "background",
        id: BACKGROUND_PALETTE_COLLECTION_0000.id
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [],
          currentCollectionId: null
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle DELETE_PALETTE_COLLECTION action when there are many collections", () => {
    const state: State = deepFreeze({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            BACKGROUND_PALETTE_COLLECTION_0000,
            BACKGROUND_PALETTE_COLLECTION_0001
          ],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });

    const newState = reducer(state, {
      type: ActionTypes.DELETE_PALETTE_COLLECTION,
      payload: {
        type: "background",
        id: BACKGROUND_PALETTE_COLLECTION_0000.id
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [BACKGROUND_PALETTE_COLLECTION_0001],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0001.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle CHANGE_GAME_PALETTE_COLOR action when non-shared color changed", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
      payload: {
        type: "background",
        paletteCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id,
        gamePaletteIndex: 1,
        valueIndex: 2,
        newColor: {
          id: 63,
          available: true,
          name: "Black Copy #8",
          rgb: "#000"
        }
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            {
              ...BACKGROUND_PALETTE_COLLECTION_0000,
              gamePalettes: [
                { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
                { colorIndexes: [0x00, 0x00, 0x3f, 0x00] },
                { colorIndexes: [0x00, 0x00, 0x00, 0x00] },
                { colorIndexes: [0x00, 0x00, 0x00, 0x00] }
              ]
            }
          ],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle CHANGE_GAME_PALETTE_COLOR action when shared color changed", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
      payload: {
        type: "background",
        paletteCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id,
        gamePaletteIndex: 1,
        valueIndex: 0,
        newColor: {
          id: 63,
          available: true,
          name: "Black Copy #8",
          rgb: "#000"
        }
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      paletteCollections: {
        background: {
          collections: [
            {
              ...BACKGROUND_PALETTE_COLLECTION_0000,
              gamePalettes: [
                { colorIndexes: [0x3f, 0x00, 0x00, 0x00] },
                { colorIndexes: [0x3f, 0x00, 0x00, 0x00] },
                { colorIndexes: [0x3f, 0x00, 0x00, 0x00] },
                { colorIndexes: [0x3f, 0x00, 0x00, 0x00] }
              ]
            }
          ],
          currentCollectionId: BACKGROUND_PALETTE_COLLECTION_0000.id
        },
        sprite: DEFAULT_STATE.paletteCollections.sprite
      }
    });
  });

  it("should handle SELECT_PATTERN_TABLE action", () => {
    const state: State = deepFreeze({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            BACKGROUND_PATTERN_TABLE_0000,
            BACKGROUND_PATTERN_TABLE_0001
          ],
          currentTableId: BACKGROUND_PATTERN_TABLE_0000.id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });

    const newState = reducer(state, {
      type: ActionTypes.SELECT_PATTERN_TABLE,
      payload: { type: "background", id: BACKGROUND_PATTERN_TABLE_0001.id }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            BACKGROUND_PATTERN_TABLE_0000,
            BACKGROUND_PATTERN_TABLE_0001
          ],
          currentTableId: BACKGROUND_PATTERN_TABLE_0001.id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });

  it("should handle ADD_NEW_PATTERN_TABLE action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.ADD_NEW_PATTERN_TABLE,
      payload: { type: "background", label: "New Table Label" }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            BACKGROUND_PATTERN_TABLE_0000,
            {
              id: expect.stringMatching(/.+/),
              label: "New Table Label",
              tiles: range(0, 256).map(() => ({
                pixels: new Uint8Array(64)
              }))
            }
          ],
          currentTableId: newState.patternTables.background.tables[1].id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });

  it("should handle UPDATE_PATTERN_TABLE_METADATA action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.UPDATE_PATTERN_TABLE_METADATA,
      payload: {
        type: "background",
        id: BACKGROUND_PATTERN_TABLE_0000.id,
        label: "New Table Label"
      }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            {
              ...BACKGROUND_PATTERN_TABLE_0000,
              label: "New Table Label"
            }
          ],
          currentTableId: BACKGROUND_PATTERN_TABLE_0000.id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });

  it("should handle COPY_PATTERN_TABLE action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.COPY_PATTERN_TABLE,
      payload: { type: "background", id: BACKGROUND_PATTERN_TABLE_0000.id }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            BACKGROUND_PATTERN_TABLE_0000,
            {
              ...BACKGROUND_PATTERN_TABLE_0000,
              id: expect.stringMatching(/.+/),
              label: BACKGROUND_PATTERN_TABLE_0000.label + " Copy"
            }
          ],
          currentTableId: newState.patternTables.background.tables[1].id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });

  it("should handle DELETE_PATTERN_TABLE action when only one table", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.DELETE_PATTERN_TABLE,
      payload: { type: "background", id: BACKGROUND_PATTERN_TABLE_0000.id }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [],
          currentTableId: null
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });

  it("should handle DELETE_PATTERN_TABLE action when has many tables", () => {
    const state: State = deepFreeze({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            BACKGROUND_PATTERN_TABLE_0000,
            BACKGROUND_PATTERN_TABLE_0001
          ],
          currentTableId: BACKGROUND_PATTERN_TABLE_0000.id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });

    const newState = reducer(state, {
      type: ActionTypes.DELETE_PATTERN_TABLE,
      payload: { type: "background", id: BACKGROUND_PATTERN_TABLE_0000.id }
    });

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [BACKGROUND_PATTERN_TABLE_0001],
          currentTableId: BACKGROUND_PATTERN_TABLE_0001.id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });

  it("should handle CHANGE_PATTERN_TABLE_PIXELS action", () => {
    const state: State = DEFAULT_STATE;

    const newState = reducer(state, {
      type: ActionTypes.CHANGE_PATTERN_TABLE_PIXELS,
      payload: {
        type: "background",
        tableId: BACKGROUND_PATTERN_TABLE_0000.id,
        tileIndex: 1,
        startPixelIndex: 2,
        newPixels: [3]
      }
    });

    const newPixels = new Uint8Array(64);
    newPixels.set([3], 2);

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      patternTables: {
        background: {
          tables: [
            {
              ...BACKGROUND_PATTERN_TABLE_0000,
              tiles: [
                newState.patternTables.background.tables[0].tiles[0],
                {
                  pixels: newPixels
                },
                ...newState.patternTables.background.tables[0].tiles.slice(2)
              ]
            }
          ],
          currentTableId: BACKGROUND_PATTERN_TABLE_0000.id
        },
        sprite: DEFAULT_STATE.patternTables.sprite
      }
    });
  });
});
