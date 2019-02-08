import {
  Nametable,
  GamePaletteCollection,
  PatternTable,
  SystemPalette,
  GamePaletteType,
  PatternTableType,
  Color
} from "../../../types";

export enum ActionTypes {
  SELECT_NAMETABLE = "SELECT_NAMETABLE",
  ADD_NEW_NAMETABLE = "ADD_NEW_NAMETABLE",
  UPDATE_NAMETABLE_METADATA = "UPDATE_NAMETABLE_METADATA",
  COPY_NAMETABLE = "COPY_NAMETABLE",
  DELETE_NAMETABLE = "DELETE_NAMETABLE",
  CHANGE_NAMETABLE_TILE_INDEX = "CHANGE_NAMETABLE_TILE_INDEX",
  CHANGE_NAMETABLE_PALETTE_INDEX = "CHANGE_NAMETABLE_PALETTE_INDEX",

  SELECT_SYSTEM_PALETTE = "SELECT_SYSTEM_PALETTE",
  SELECT_PALETTE_COLLECTION = "SELECT_PALETTE_COLLECTION",
  ADD_NEW_PALETTE_COLLECTION = "ADD_NEW_PALETTE_COLLECTION",
  UPDATE_PALETTE_COLLECTION_METADATA = "UPDATE_PALETTE_COLLECTION_METADATA",
  COPY_PALETTE_COLLECTION = "COPY_PALETTE_COLLECTION",
  DELETE_PALETTE_COLLECTION = "DELETE_PALETTE_COLLECTION",
  CHANGE_GAME_PALETTE_COLOR = "CHANGE_GAME_PALETTE_COLOR",

  SELECT_PATTERN_TABLE = "SELECT_PATTERN_TABLE",
  ADD_NEW_PATTERN_TABLE = "ADD_NEW_PATTERN_TABLE",
  UPDATE_PATTERN_TABLE_METADATA = "UPDATE_PATTERN_TABLE_METADATA",
  COPY_PATTERN_TABLE = "COPY_PATTERN_TABLE",
  DELETE_PATTERN_TABLE = "DELETE_PATTERN_TABLE",
  CHANGE_PATTERN_TABLE_PIXELS = "CHANGE_PATTERN_TABLE_PIXELS"
}

export type PaletteCollectionState = {
  collections: Array<GamePaletteCollection>;
  currentCollectionId: GamePaletteCollection["id"] | null;
};

export type PatternTableState = {
  tables: Array<PatternTable>;
  currentTableId: PatternTable["id"] | null;
};

export type State = {
  nametables: Array<Nametable>;
  currentNametableId: Nametable["id"] | null;

  systemPalettes: Array<SystemPalette>;
  // There will always be at least one system palette,
  // and so always a current system palette.
  currentSystemPaletteId: SystemPalette["id"];
  paletteCollections: { [key in GamePaletteType]: PaletteCollectionState };

  patternTables: { [key in PatternTableType]: PatternTableState };
};

export type ReduxStateSlice = {
  editor: State;
};

export type Action =
  | {
      type: ActionTypes.SELECT_NAMETABLE;
      payload: {
        id: Nametable["id"];
      };
    }
  | {
      type: ActionTypes.ADD_NEW_NAMETABLE;
      payload: {
        label: Nametable["label"];
      };
    }
  | {
      type: ActionTypes.UPDATE_NAMETABLE_METADATA;
      payload: {
        id: Nametable["id"];
        label: Nametable["label"];
      };
    }
  | {
      type: ActionTypes.COPY_NAMETABLE;
      payload: {
        id: Nametable["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_NAMETABLE;
      payload: {
        id: Nametable["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_NAMETABLE_TILE_INDEX;
      payload: {
        nametableId: Nametable["id"];
        tileIndex: number;
        newValue: number;
      };
    }
  | {
      type: ActionTypes.CHANGE_NAMETABLE_PALETTE_INDEX;
      payload: {
        nametableId: Nametable["id"];
        paletteIndex: number;
        newValue: number;
      };
    }
  | {
      type: ActionTypes.SELECT_SYSTEM_PALETTE;
      payload: {
        id: SystemPalette["id"];
      };
    }
  | {
      type: ActionTypes.SELECT_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.ADD_NEW_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        label: GamePaletteCollection["label"];
      };
    }
  | {
      type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
        label: GamePaletteCollection["label"];
      };
    }
  | {
      type: ActionTypes.COPY_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_GAME_PALETTE_COLOR;
      payload: {
        type: GamePaletteType;
        paletteCollectionId: GamePaletteCollection["id"];
        gamePaletteIndex: number;
        valueIndex: number;
        newColor: Color;
      };
    }
  | {
      type: ActionTypes.SELECT_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.ADD_NEW_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        label: PatternTable["label"];
      };
    }
  | {
      type: ActionTypes.UPDATE_PATTERN_TABLE_METADATA;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
        label: PatternTable["label"];
      };
    }
  | {
      type: ActionTypes.COPY_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_PATTERN_TABLE_PIXELS;
      payload: {
        type: PatternTableType;
        tableId: PatternTable["id"];
        tileIndex: number;
        startPixelIndex: number;
        newPixels: Array<number>;
      };
    };
