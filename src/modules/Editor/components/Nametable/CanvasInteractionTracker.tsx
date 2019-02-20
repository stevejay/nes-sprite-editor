import classNames from "classnames";
import React from "react";
import styles from "./CanvasInteractionTracker.module.scss";
import {
  ViewportSize,
  convertViewportCoordToNametableMetatile,
  TilePosition
} from "./experiment";
import { State as ViewportState } from "./viewport-reducer";

export type FlattenedLogicalCoord = {
  tileIndex: number;
  tilePixelIndex: number;
};

type Props = {
  viewportSize: ViewportSize;
  viewportState?: ViewportState; // problem here
  className?: string;
  children?: React.ReactNode;
  onMouseMove?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tilePosition: TilePosition
  ) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number
  ) => void;
};

const CanvasInteractionTracker = ({
  viewportSize,
  viewportState,
  className,
  children,
  onMouseMove,
  onMouseLeave,
  onClick
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = ref!.current!.getBoundingClientRect();
    const yInContainer = event.clientY - boundingRect.top;
    const xInContainer = event.clientX - boundingRect.left;
    const tilePosition = convertViewportCoordToNametableMetatile(
      viewportState!,
      { x: xInContainer, y: yInContainer }
    );
    onMouseMove!(event, tilePosition);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = ref!.current!.getBoundingClientRect();
    const yInContainer = event.clientY - boundingRect.top;
    const xInContainer = event.clientX - boundingRect.left;

    if (
      xInContainer < 0 ||
      xInContainer > viewportSize.width ||
      yInContainer < 0 ||
      yInContainer > viewportSize.height
    ) {
      return;
    }

    onClick!(event, xInContainer, yInContainer);
  };

  return (
    <div
      ref={ref}
      className={classNames(styles.container, className)}
      style={viewportSize}
      onMouseMove={onMouseMove ? handleMouseMove : undefined}
      onMouseLeave={onMouseLeave}
      onClick={onClick ? handleClick : undefined}
    >
      {children}
    </div>
  );
};

export default CanvasInteractionTracker;
