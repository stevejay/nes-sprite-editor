import { cloneDeep, find, isEmpty } from "lodash";
import uuidv4 from "uuid/v4";
import { GamePaletteCollection } from "../types";
import { Action, ActionTypes, PaletteCollectionState } from "./types";

export default function paletteCollectionSliceReducer(
  state: PaletteCollectionState,
  action: Action
): PaletteCollectionState {
  switch (action.type) {
    case ActionTypes.SELECT_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        currentCollectionId: collectionMatch.id
      };
    }
    case ActionTypes.ADD_NEW_PALETTE_COLLECTION: {
      const newCollection: GamePaletteCollection = {
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
        collections: [...state.collections, newCollection],
        currentCollectionId: newCollection.id
      };
    }
    case ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        collections: state.collections.map(collection =>
          collection.id === collectionMatch.id
            ? { ...collection, label: action.payload.label }
            : collection
        )
      };
    }
    case ActionTypes.COPY_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.collections,
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
        collections: [...state.collections, newCollection],
        currentCollectionId: newCollection.id
      };
    }
    case ActionTypes.DELETE_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      const newCollections = state.collections.filter(
        collection => collection.id !== collectionMatch.id
      );
      return {
        ...state,
        collections: newCollections,
        currentCollectionId:
          state.currentCollectionId === collectionMatch.id
            ? isEmpty(newCollections)
              ? null
              : newCollections[0].id
            : state.currentCollectionId
      };
    }
    case ActionTypes.CHANGE_GAME_PALETTE_COLOR: {
      const {
        paletteCollectionId,
        gamePaletteIndex,
        valueIndex,
        newColor
      } = action.payload;

      const collectionMatch = find(
        state.collections,
        collection => collection.id === paletteCollectionId
      );
      if (!collectionMatch) {
        return state;
      }

      return {
        ...state,
        collections: state.collections.map(collection => {
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
