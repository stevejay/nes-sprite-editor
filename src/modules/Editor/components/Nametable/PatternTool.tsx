import { isNil } from "lodash";
import React from "react";
import useOpenDialog from "../../../../shared/utils/use-open-dialog";
import CanvasHighlight from "./CanvasHighlight";
import CanvasInteractionTracker from "./CanvasInteractionTracker";
import { PatternTableModal } from "../PatternTable";
import { TilePosition, ViewportSize } from "./experiment";
import styles from "./PatternTool.module.scss";
import { Nametable, PatternTable, GamePaletteWithColors } from "../../store";
import {
  Action as ToolAction,
  ActionTypes as ToolActionTypes,
  State as ToolState
} from "./tool-reducer";
import { State as ViewportState } from "./viewport-reducer";

type Props = {
  currentTile: ToolState["currentTile"];
  selectedColorIndex: ToolState["selectedColorIndex"];
  viewportSize: ViewportSize;
  viewportState: ViewportState;
  currentPalette: GamePaletteWithColors;
  toolDispatch: React.Dispatch<ToolAction>;
  isLocked: boolean;
  patternTable: PatternTable | null;
  nametable: Nametable | null;
  onChange: (id: string, tileIndex: number, newValue: number) => void;
};

const PatternTool = ({
  nametable,
  patternTable,
  currentTile,
  currentPalette,
  viewportSize,
  viewportState,
  toolDispatch,
  isLocked,
  onChange
}: Props) => {
  const highlightBoxRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, handleOpen, handleClose] = useOpenDialog();
  const [patternTileIndex, setPatternTileIndex] = React.useState(0);

  const handleMouseMove = (
    _event: React.MouseEvent<HTMLDivElement>,
    tilePosition: TilePosition
  ) => {
    if (currentTile.tileIndex !== tilePosition.tileIndex) {
      toolDispatch({
        type: ToolActionTypes.CURRENT_TILE_UPDATED,
        payload: tilePosition
      });
    }
  };

  const handleMouseLeave = () => {
    if (currentTile.tileIndex) {
      toolDispatch({
        type: ToolActionTypes.CURRENT_TILE_UPDATED,
        payload: { tileIndex: null, metatileIndex: null }
      });
    }
  };

  const handleSelectTile = React.useCallback(
    (value: number) => {
      if (isNil(nametable) || isNil(patternTileIndex)) {
        return;
      }

      onChange(nametable.id, patternTileIndex, value);
    },
    [onChange, nametable, patternTileIndex]
  );

  const handleHighlightClick = () => {
    if (currentTile.tileIndex) {
      setPatternTileIndex(currentTile.tileIndex);
    }
    handleOpen();
  };

  return (
    <>
      <CanvasInteractionTracker
        className={styles.tool}
        viewportSize={viewportSize}
        viewportState={viewportState}
        // onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CanvasHighlight
          currentTile={currentTile}
          currentTool="pattern"
          viewportState={viewportState}
          isLocked={isLocked}
          onClick={handleHighlightClick}
        />
      </CanvasInteractionTracker>
      <PatternTableModal
        isOpen={isOpen}
        patternTable={patternTable}
        palette={currentPalette}
        selectedTileIndex={nametable!.tileIndexes[patternTileIndex]}
        originElement={highlightBoxRef.current}
        onSelectTile={handleSelectTile}
        onClose={handleClose}
      />
    </>
  );
};

export default PatternTool;
