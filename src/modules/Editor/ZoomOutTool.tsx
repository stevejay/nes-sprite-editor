import React from "react";
import CanvasInteractionTracker from "./CanvasInteractionTracker";
import { ViewportSize } from "./experiment";
import {
  Action as ViewportAction,
  ActionTypes as ViewportActionTypes
} from "./viewport-reducer";
import styles from "./ZoomOutTool.module.scss";

type Props = {
  viewportSize: ViewportSize;
  viewportDispatch: React.Dispatch<ViewportAction>;
};

const ZoomOutTool = ({ viewportSize, viewportDispatch }: Props) => {
  const handleClick = (
    _event: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    viewportDispatch({
      type: ViewportActionTypes.ZOOM_OUT,
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

export default ZoomOutTool;
