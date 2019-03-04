import { AnyAction } from "redux";

export type Entity = {
  id: string;
  label: string;
};

export type Color =
  | {
      available: false;
      id: number;
    }
  | {
      available: true;
      id: number;
      name: string;
      rgb: string;
    };

export type SystemPalette = {
  id: string;
  label: string;
  values: Array<Color>; // 64 colors
};

export type GamePalette = {
  colorIndexes: Array<Color["id"]>; // 4 color ids
};

export type GamePaletteWithColors = GamePalette & {
  colors: Array<Color>;
};

export type GamePaletteType = "background" | "sprite";

export type GamePaletteCollection = Entity & {
  type: GamePaletteType;
  id: string;
  label: string;
  gamePalettes: Array<GamePalette>; // 4 palettes
};

export type GamePaletteCollectionWithColors = {
  type: GamePaletteType;
  id: GamePaletteCollection["id"];
  label: GamePaletteCollection["label"];
  gamePalettes: Array<GamePaletteWithColors>;
};

// 8x8 area of pixels
export type PatternTile = {
  // Either:
  // - 64 pixels, each value 0 to 3 (palette index)
  // - one value 0 to 3 that all 64 pixels have
  pixels: Uint8Array | number;
  isLocked: boolean;
};

export type PatternTableType = "background" | "sprite";

// 16x16 area of pattern tiles
export type PatternTable = Entity & {
  type: PatternTableType;
  id: string;
  label: string;
  tiles: Array<PatternTile>; // 256 tiles (16x16)
};

// 32x30 area of pattern tiles
export type Nametable = Entity & {
  id: string;
  label: string;
  tileIndexes: Uint8Array; // 960 bytes
  paletteIndexes: Uint8Array; // 64 * 4 indexes, which gets output as 4 indexes to a byte
};

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
  CHANGE_PATTERN_TABLE_PIXELS = "CHANGE_PATTERN_TABLE_PIXELS",
  CHANGE_PATTERN_TABLE_TILE_LOCK = "CHANGE_PATTERN_TABLE_TILE_LOCK",
  UPDATE_SELECTED_PATTERN_TABLE_TILE_INDEX = "UPDATE_SELECTED_PATTERN_TABLE_TILE_INDEX"
}

export type State = {
  nametables: Array<Nametable>;
  selectedNametableId: Nametable["id"] | null;
  systemPalettes: Array<SystemPalette>;
  selectedSystemPaletteId: SystemPalette["id"];
  paletteCollections: Array<GamePaletteCollection>;
  selectedPaletteCollectionIds: {
    [key in GamePaletteType]: GamePaletteCollection["id"] | null
  };
  patternTables: Array<PatternTable>;
  selectedPatternTableIds: {
    [key in PatternTableType]: PatternTable["id"] | null
  };
  selectedPatternTableTileIndex: number;
};

export type EditorStateSlice = {
  editor: State;
};

export type Action =
  | AnyAction
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
        id: GamePaletteCollection["id"];
        label: GamePaletteCollection["label"];
      };
    }
  | {
      type: ActionTypes.COPY_PALETTE_COLLECTION;
      payload: {
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_PALETTE_COLLECTION;
      payload: {
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_GAME_PALETTE_COLOR;
      payload: {
        id: GamePaletteCollection["id"];
        gamePaletteIndex: number;
        valueIndex: number;
        newColor: Color;
      };
    }
  | {
      type: ActionTypes.SELECT_PATTERN_TABLE;
      payload: {
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
        id: PatternTable["id"];
        label: PatternTable["label"];
      };
    }
  | {
      type: ActionTypes.COPY_PATTERN_TABLE;
      payload: {
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_PATTERN_TABLE;
      payload: {
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_PATTERN_TABLE_PIXELS;
      payload: {
        id: PatternTable["id"];
        tileIndex: number;
        startPixelIndex: number;
        newPixels: Array<number>;
      };
    }
  | {
      type: ActionTypes.CHANGE_PATTERN_TABLE_TILE_LOCK;
      payload: {
        id: PatternTable["id"];
        tileIndex: number;
        isLocked: boolean;
      };
    }
  | {
      type: ActionTypes.UPDATE_SELECTED_PATTERN_TABLE_TILE_INDEX;
      payload: {
        tileIndex: number;
      };
    };
