import { cloneDeep, find } from "lodash";
import uuidv4 from "uuid/v4";
import { Action, ActionTypes, State, GamePaletteCollection } from "../types";

export const initialState: Partial<State> = {
  paletteCollections: [
    {
      type: "background",
      id: "0",
      label: "Backgrounds #0",
      gamePalettes: [
        { colorIndexes: [0x0f, 19, 20, 21] },
        { colorIndexes: [0x0f, 23, 24, 25] },
        { colorIndexes: [0x0f, 0x30, 0x23, 0x16] },
        { colorIndexes: [0x0f, 38, 39, 40] }
      ]
    },
    {
      type: "sprite",
      id: "1",
      label: "Sprites #0",
      gamePalettes: [
        { colorIndexes: [0x0f, 1, 20, 5] },
        { colorIndexes: [0x0f, 2, 24, 6] },
        { colorIndexes: [0x0f, 3, 35, 7] },
        { colorIndexes: [0x0f, 4, 39, 8] }
      ]
    }
  ],
  selectedPaletteCollectionIds: {
    background: "0",
    sprite: "1"
  }
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.SELECT_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [collectionMatch.type]: collectionMatch.id
        }
      };
    }
    case ActionTypes.ADD_NEW_PALETTE_COLLECTION: {
      const newCollection: GamePaletteCollection = {
        type: action.payload.type,
        id: uuidv4(),
        label: action.payload.label,
        gamePalettes: [
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] }
        ]
      };
      return {
        ...state,
        paletteCollections: [...state.paletteCollections, newCollection],
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [action.payload.type]: newCollection.id
        }
      };
    }
    case ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        paletteCollections: state.paletteCollections.map(collection =>
          collection.id === collectionMatch.id
            ? { ...collection, label: action.payload.label }
            : collection
        )
      };
    }
    case ActionTypes.COPY_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      const newCollection = {
        ...cloneDeep(collectionMatch),
        id: uuidv4(),
        label: collectionMatch.label + " Copy"
      };
      return {
        ...state,
        paletteCollections: [...state.paletteCollections, newCollection],
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [newCollection.type]: newCollection.id
        }
      };
    }
    case ActionTypes.DELETE_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      const newCollections = state.paletteCollections.filter(
        collection => collection.id !== collectionMatch.id
      );
      const fallbackCollection = find(
        newCollections,
        collection => collection.type === collectionMatch.type
      );
      const currentCollectionId =
        state.selectedPaletteCollectionIds[collectionMatch.type];
      return {
        ...state,
        paletteCollections: newCollections,
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [collectionMatch.type]:
            currentCollectionId === collectionMatch.id
              ? fallbackCollection
                ? fallbackCollection.id
                : null
              : currentCollectionId
        }
      };
    }
    case ActionTypes.CHANGE_GAME_PALETTE_COLOR: {
      const { id, gamePaletteIndex, valueIndex, newColor } = action.payload;
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        paletteCollections: state.paletteCollections.map(collection => {
          if (collection.id !== collectionMatch.id) {
            return collection;
          }
          return {
            ...collection,
            gamePalettes: collection.gamePalettes.map((palette, index) => {
              const paletteIndexMatch = index === gamePaletteIndex;
              const changingFirstColor = valueIndex === 0;

              if (paletteIndexMatch || changingFirstColor) {
                const colorIndexes = palette.colorIndexes.slice();
                colorIndexes[valueIndex] = newColor.id;
                return {
                  ...palette,
                  colorIndexes
                };
              }

              return palette;
            })
          };
        })
      };
    }
    default:
      return state;
  }
}
