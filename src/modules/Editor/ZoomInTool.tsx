import React from "react";
import CanvasInteractionTracker from "./CanvasInteractionTracker";
import { ViewportSize } from "./experiment";
import {
  Action as ViewportAction,
  ActionTypes as ViewportActionTypes
} from "./viewport-reducer";
import styles from "./ZoomInTool.module.scss";

type Props = {
  viewportSize: ViewportSize;
  viewportDispatch: React.Dispatch<ViewportAction>;
};

const ZoomInTool = ({ viewportSize, viewportDispatch }: Props) => {
  const handleClick = (
    _event: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    viewportDispatch({
      type: ViewportActionTypes.ZOOM_IN,
      payload: { x, y }
    });
  };

  return (
    <CanvasInteractionTracker
      className={styles.tool}
      viewportSize={viewportSize}
      onClick={handleClick}
    />
  );
};

export default ZoomInTool;
