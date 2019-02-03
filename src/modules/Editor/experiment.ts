export type ViewportCoord = {
  x: number;
  y: number;
};

// gets drawn with transparency svg for background
export type ViewportSize = {
  widthPx: number;
  heightPx: number;
};

export type ViewportScale = 1 | 2;

export type Scale = number; // 0.5 | 1 | 2 | 4 | 8 | 16;

export type LogicalCoord = {
  xLogicalPx: number;
  yLogicalPx: number;
};

export type LogicalSize = {
  widthLogicalPx: number;
  heightLogicalPx: number;
};

export type RenderCanvasPositioning = {
  origin: LogicalCoord;
  size: LogicalSize;
  scale: Scale;
  viewportOffset: LogicalCoord;
};

export type DragBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const TOTAL_NAMETABLE_X_TILES = 32;
const TOTAL_NAMETABLE_Y_TILES = 30;
const TILE_SIZE_PIXELS = 8;

// Creates a square viewport
export function createViewportSize(scale: ViewportScale): ViewportSize {
  const dimension =
    TILE_SIZE_PIXELS *
    Math.max(TOTAL_NAMETABLE_X_TILES, TOTAL_NAMETABLE_Y_TILES) *
    scale;
  return { widthPx: dimension, heightPx: dimension };
}

export function createInitialRenderCanvasPositioning(
  viewportSize: ViewportSize
): RenderCanvasPositioning {
  // scale the canvas so the entire tile grid fits,
  // by using the smaller viewport dimension:
  const scale =
    viewportSize.widthPx <= viewportSize.heightPx
      ? viewportSize.widthPx / (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES)
      : viewportSize.heightPx / (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES);

  // work out what that means for the viewportXPx value:
  const scaledWidth = scale * (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES);
  const viewportXPx = (viewportSize.widthPx - scaledWidth) * 0.5;

  // work out what that means for the viewportYPx value:
  const scaledHeight = scale * (TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES);
  const viewportYPx = (viewportSize.heightPx - scaledHeight) * 0.5;

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
      xLogicalPx: 0,
      yLogicalPx: 8
    }


    xTileIndex: 0,
    yTileIndex: 0,
    widthTiles: TOTAL_NAMETABLE_X_TILES,
    heightTiles: TOTAL_NAMETABLE_Y_TILES,
    scale,
    viewportXPx,
    viewportYPx
  };
}

// export function createCanvasSize(renderCanvasPositioning: RenderCanvasPositioning): ??? {
//   // TODO
//   // take retina into account.

// }

// temp
// export function calculateRenderCanvasPositioningForViewport(
//   viewportCenterLogicalCoord: LogicalCoord,
//   viewportSize: ViewportSize,
//   scale: Scale
// ): RenderCanvasPositioning {}

// export function calculateDragBounds(
//   renderCanvasPositioning: RenderCanvasPositioning,
//   viewportSize: ViewportSize
// ): DragBounds {
//   // calculate logical position of (viewportXPx, viewportYPx)
//   // calculate tile width and height of viewable area
//   // work out how many pixels are available each way
//   // OR we always calculate the same value???
//   return {
//     left: 0,
//     top: 0,
//     right: 0,
//     bottom: 0
//   };
// }

export function moveRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportSize: ViewportSize,
  viewportDelta: ViewportCoord
): RenderCanvasPositioning {
  return renderCanvasPositioning;
}

export function zoomIntoRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  zoomCenterViewportCoord: ViewportCoord
): RenderCanvasPositioning {
  //

  return renderCanvasPositioning;
}

export function zoomOutOfRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  zoomOriginViewportCoord: ViewportCoord
): RenderCanvasPositioning {
  return renderCanvasPositioning;
}

// Used for tools like pencil to see which tile/pixel the tool should affect.
// Returns null if viewportCoords is not a point within the canvas.
export function convertViewportCoordsToLogicalCoords(
  viewportCoords: ViewportCoord,
  renderCanvasPositioning: RenderCanvasPositioning
): LogicalCoord | null {
  const yValue =
    (viewportCoords.y - renderCanvasPositioning.viewportYPx) /
    (TILE_SIZE_PIXELS * renderCanvasPositioning.scale);

  const flooredYValue = Math.floor(yValue);

  const xValue =
    (viewportCoords.x - renderCanvasPositioning.viewportXPx) /
    (TILE_SIZE_PIXELS * renderCanvasPositioning.scale);

  const flooredXValue = Math.floor(xValue);

  const result = {
    xTileIndex: flooredXValue,
    xTilePixelIndex: Math.floor((xValue - flooredXValue) * TILE_SIZE_PIXELS),
    yTileIndex: flooredYValue,
    yTilePixelIndex: Math.floor((yValue - flooredYValue) * TILE_SIZE_PIXELS)
  };

  if (
    result.xTileIndex < 0 ||
    result.xTileIndex >= TOTAL_NAMETABLE_X_TILES ||
    result.yTileIndex < 0 ||
    result.yTileIndex >= TOTAL_NAMETABLE_Y_TILES
  ) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    if (
      result.xTilePixelIndex < 0 ||
      result.xTilePixelIndex >= TILE_SIZE_PIXELS ||
      result.yTilePixelIndex < 0 ||
      result.yTilePixelIndex >= TILE_SIZE_PIXELS
    ) {
      throw new Error(
        `invalid tile pixel index: ${viewportCoords} ${renderCanvasPositioning} ${result}`
      );
    }
  }

  return result;
}
