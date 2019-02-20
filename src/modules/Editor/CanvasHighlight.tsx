import React, { CSSProperties } from "react";
import { convertTilePositionToCanvasCoords } from "./experiment";
import { State as ToolState } from "./tool-reducer";
import { State as ViewportState } from "./viewport-reducer";
import styles from "./CanvasHighlight.module.scss";
import { isNil } from "lodash";
import { FiLock } from "react-icons/fi";

type Props = {
  currentTile: ToolState["currentTile"];
  currentTool: ToolState["currentTool"];
  viewportState: ViewportState;
  isLocked: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const CanvasHighlight = React.forwardRef<HTMLDivElement, Props>(
  ({ currentTile, currentTool, viewportState, isLocked, onClick }, ref) => {
    const highlightBoxStyle = React.useMemo<CSSProperties | null>(() => {
      const highlightArea = isNil(currentTile.tileIndex)
        ? null
        : convertTilePositionToCanvasCoords(
            viewportState,
            currentTile,
            currentTool === "palette"
          );

      return isNil(highlightArea)
        ? null
        : {
            top: highlightArea.y,
            left: highlightArea.x,
            width: highlightArea.width,
            height: highlightArea.height
          };
    }, [viewportState, currentTile, currentTool]);

    if (!highlightBoxStyle) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={styles.highlight}
        style={highlightBoxStyle}
        onClick={onClick}
      >
        {isLocked && <FiLock />}
      </div>
    );
  }
);

export default CanvasHighlight;
