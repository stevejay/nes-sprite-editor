import {
  RenderCanvasPositioning,
  ViewportCoord,
  ViewportSize,
  Scale,
  LogicalCoord,
  LogicalSize,
  convertViewportCoordToLogicalCoord
} from "./experiment";
import React from "react";
import {
  TILE_SIZE_PIXELS,
  TOTAL_NAMETABLE_X_TILES,
  TOTAL_NAMETABLE_Y_TILES,
  CANVAS_OVERDRAW_SCALING
} from "../../constants";

export const VIEWPORT_SIZE: ViewportSize = { width: 512, height: 512 };

export type State = RenderCanvasPositioning;

export enum ActionTypes {
  INITIALIZE = "INITIALIZE",
  CHANGE_SCALE = "CHANGE_SCALE",
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  MOVE = "MOVE"
}

export type Action =
  | {
      type: ActionTypes.CHANGE_SCALE;
      payload: RenderCanvasPositioning["scale"];
    }
  | { type: ActionTypes.INITIALIZE }
  | { type: ActionTypes.ZOOM_IN; payload: ViewportCoord }
  | { type: ActionTypes.ZOOM_OUT; payload: ViewportCoord }
  | { type: ActionTypes.MOVE; payload: ViewportCoord };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.INITIALIZE:
      return initializeReducer();
    case ActionTypes.CHANGE_SCALE:
      return adjustZoomOfRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case ActionTypes.ZOOM_IN:
      return zoomIntoRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case ActionTypes.ZOOM_OUT:
      return zoomOutOfRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case ActionTypes.MOVE:
      return moveRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    default:
      return state;
  }
}

export function useViewportReducer() {
  return React.useReducer(reducer, initializeReducer());
}

function initializeReducer(): State {
  return createInitialRenderCanvasPositioning(VIEWPORT_SIZE);
}

function createInitialRenderCanvasPositioning(
  viewportSize: ViewportSize
): RenderCanvasPositioning {
  const scale = calculateBestNaturalScaleForViewportSize(viewportSize);

  // work out what that means for the viewportXPx value:
  const scaledWidth = scale * (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES);
  const xLogicalPx = ((viewportSize.width - scaledWidth) * 0.5) / scale;

  // work out what that means for the viewportYPx value:
  const scaledHeight = scale * (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES);
  const yLogicalPx = ((viewportSize.height - scaledHeight) * 0.5) / scale;

  return {
    origin: {
      xLogicalPx: 0,
      yLogicalPx: 0
    },
    size: {
      widthLogicalPx: TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES,
      heightLogicalPx: TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES
    },
    scale,
    viewportOffset: {
      xLogicalPx,
      yLogicalPx
    }
  };
}

export function calculateBestNaturalScaleForViewportSize(
  viewportSize: ViewportSize
): Scale {
  // Calculate the value that allows the entire tile grid to fit
  // in the viewport by using the smaller viewport dimension:
  const rawScale =
    viewportSize.width <= viewportSize.height
      ? viewportSize.width / (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES)
      : viewportSize.height / (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES);

  if (rawScale < 1) {
    return 0.5;
  } else if (rawScale < 2) {
    return 1;
  } else if (rawScale < 4) {
    return 2;
  } else if (rawScale < 8) {
    return 4;
  } else if (rawScale < 16) {
    return 8;
  } else {
    return 16;
  }
}

function adjustZoomOfRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportSize: ViewportSize,
  newScale: Scale
): RenderCanvasPositioning {
  const logicalZoomCenterViewportCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    {
      x: viewportSize.width / 2,
      y: viewportSize.height / 2
    }
  );

  return createRenderCanvasPositioningCenteredOnLogicalCoord(
    logicalZoomCenterViewportCoord,
    viewportSize,
    newScale
  );
}

function zoomIntoRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportSize: ViewportSize,
  zoomCenterViewportCoord: ViewportCoord
): RenderCanvasPositioning {
  const newScale = zoomInScale(renderCanvasPositioning.scale);
  if (newScale === renderCanvasPositioning.scale) {
    return renderCanvasPositioning;
  }

  const logicalZoomCenterViewportCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    zoomCenterViewportCoord
  );

  return createRenderCanvasPositioningCenteredOnLogicalCoord(
    logicalZoomCenterViewportCoord,
    viewportSize,
    newScale
  );
}

function zoomOutOfRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportSize: ViewportSize,
  zoomCenterViewportCoord: ViewportCoord
): RenderCanvasPositioning {
  const newScale = zoomOutScale(renderCanvasPositioning.scale);
  if (newScale === renderCanvasPositioning.scale) {
    return renderCanvasPositioning;
  }

  const logicalZoomCenterViewportCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    zoomCenterViewportCoord
  );

  return createRenderCanvasPositioningCenteredOnLogicalCoord(
    logicalZoomCenterViewportCoord,
    viewportSize,
    newScale
  );
}

export function moveRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportSize: ViewportSize,
  viewportDelta: ViewportCoord
): RenderCanvasPositioning {
  const moveCenterViewportCoord: ViewportCoord = {
    x: viewportSize.width * 0.5 + viewportDelta.x,
    y: viewportSize.height * 0.5 + viewportDelta.y
  };

  const logicalMoveCenterViewportCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    moveCenterViewportCoord
  );

  return createRenderCanvasPositioningCenteredOnLogicalCoord(
    logicalMoveCenterViewportCoord,
    viewportSize,
    renderCanvasPositioning.scale
  );
}

function createRenderCanvasPositioningCenteredOnLogicalCoord(
  logicalCoord: LogicalCoord,
  viewportSize: ViewportSize,
  scale: Scale
): RenderCanvasPositioning {
  const viewportLogicalSize = convertViewportSizeToLogicalSize(
    viewportSize,
    scale
  );

  const expandedViewportLogicalSize: LogicalSize = {
    widthLogicalPx:
      viewportLogicalSize.widthLogicalPx +
      viewportLogicalSize.widthLogicalPx * CANVAS_OVERDRAW_SCALING * 2,
    heightLogicalPx:
      viewportLogicalSize.heightLogicalPx +
      viewportLogicalSize.heightLogicalPx * CANVAS_OVERDRAW_SCALING * 2
  };

  const originLogicalCoord: LogicalCoord = {
    xLogicalPx:
      logicalCoord.xLogicalPx -
      expandedViewportLogicalSize.widthLogicalPx * 0.5,
    yLogicalPx:
      logicalCoord.yLogicalPx -
      expandedViewportLogicalSize.heightLogicalPx * 0.5
  };

  const viewportLogicalOffset: LogicalCoord = {
    xLogicalPx: -viewportLogicalSize.widthLogicalPx * CANVAS_OVERDRAW_SCALING,
    yLogicalPx: -viewportLogicalSize.heightLogicalPx * CANVAS_OVERDRAW_SCALING
  };

  if (originLogicalCoord.xLogicalPx < 0) {
    // canvas origin logical x is off to the left of the canvas

    // reduce width of logical canvas by the amount we are off to the left
    expandedViewportLogicalSize.widthLogicalPx =
      expandedViewportLogicalSize.widthLogicalPx +
      originLogicalCoord.xLogicalPx;

    viewportLogicalOffset.xLogicalPx =
      viewportLogicalOffset.xLogicalPx - originLogicalCoord.xLogicalPx;

    originLogicalCoord.xLogicalPx = 0;
  }

  if (originLogicalCoord.yLogicalPx < 0) {
    expandedViewportLogicalSize.heightLogicalPx =
      expandedViewportLogicalSize.heightLogicalPx +
      originLogicalCoord.yLogicalPx;

    viewportLogicalOffset.yLogicalPx =
      viewportLogicalOffset.yLogicalPx - originLogicalCoord.yLogicalPx;

    originLogicalCoord.yLogicalPx = 0;
  }

  // if (
  //   expandedViewportLogicalSize.widthLogicalPx >
  //   TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES
  // ) {
  //   expandedViewportLogicalSize.widthLogicalPx =
  //     TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES;
  // }

  // if (
  //   expandedViewportLogicalSize.heightLogicalPx >
  //   TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES
  // ) {
  //   expandedViewportLogicalSize.heightLogicalPx =
  //     TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES;
  // }

  if (viewportLogicalOffset.xLogicalPx === -0) {
    viewportLogicalOffset.xLogicalPx = 0;
  }

  if (viewportLogicalOffset.yLogicalPx === -0) {
    viewportLogicalOffset.yLogicalPx = 0;
  }

  if (
    originLogicalCoord.xLogicalPx + expandedViewportLogicalSize.widthLogicalPx >
    TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES
  ) {
    expandedViewportLogicalSize.widthLogicalPx =
      TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES -
      originLogicalCoord.xLogicalPx;
  }

  if (
    originLogicalCoord.yLogicalPx +
      expandedViewportLogicalSize.heightLogicalPx >
    TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES
  ) {
    expandedViewportLogicalSize.heightLogicalPx =
      TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES -
      originLogicalCoord.yLogicalPx;
  }

  return {
    origin: originLogicalCoord,
    size: expandedViewportLogicalSize,
    scale,
    viewportOffset: viewportLogicalOffset
  };
}

function convertViewportSizeToLogicalSize(
  viewportSize: ViewportSize,
  scale: Scale
): LogicalSize {
  return {
    widthLogicalPx: Math.floor(viewportSize.width / scale),
    heightLogicalPx: Math.floor(viewportSize.height / scale)
  };
}

function zoomOutScale(scale: Scale): Scale {
  if (scale <= 0.5) {
    return scale;
  } else if (scale <= 1) {
    return 0.5;
  } else if (scale <= 2) {
    return 1;
  } else if (scale <= 4) {
    return 2;
  } else if (scale <= 8) {
    return 4;
  } else {
    return 8;
  }
}

function zoomInScale(scale: Scale): Scale {
  if (scale >= 16) {
    return scale;
  } else if (scale >= 8) {
    return 16;
  } else if (scale >= 4) {
    return 8;
  } else if (scale >= 2) {
    return 4;
  } else if (scale >= 1) {
    return 2;
  } else {
    return 1;
  }
}
