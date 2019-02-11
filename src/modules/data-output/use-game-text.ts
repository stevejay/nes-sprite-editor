import React from "react";
import { GamePaletteCollectionWithColors } from "../editor";
import createGameDataText from "./create-game-data-text";
import useVersion from "../../shared/utils/use-version";

export default function useGameDataText(
  backgroundPalettes: GamePaletteCollectionWithColors | null,
  spritePalettes: GamePaletteCollectionWithColors | null
): [string, () => void] {
  const [version, incrementVersion] = useVersion();
  const gameDataText = React.useMemo(
    () => createGameDataText(backgroundPalettes, spritePalettes),
    [version]
  );
  return [gameDataText, incrementVersion];
}
