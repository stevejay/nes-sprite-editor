export type ViewportCoords = {
  x: number;
  y: number;
};

export type Scale = number; // 0.5 | 1 | 2 | 4 | 8 | 16;

export type LogicalCoords = {
  xTileIndex: number;
  xTilePixelIndex: number;
  yTileIndex: number;
  yTilePixelIndex: number;
};

// gets drawn with transparency svg for background
export type ViewportSize = {
  widthPx: number;
  heightPx: number;
};

// This is always sized to render some area of whole tiles
export type RenderCanvasPositioning = {
  xTileIndex: number;
  yTileIndex: number;
  widthTiles: number;
  heightTiles: number;
  scale: Scale;
  viewportXPx: number; // horizontal offset
  viewportYPx: number; // vertical offset
  dragBounds: { left: number; top: number; right: number; bottom: number };
};

const TOTAL_NAMETABLE_X_TILES = 32;
const TOTAL_NAMETABLE_Y_TILES = 30;
const TILE_SIZE_PIXELS = 8;

// Creates a square viewport size
export function createViewportSize(scale: 1 | 2): ViewportSize {
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
    xTileIndex: 0,
    yTileIndex: 0,
    widthTiles: TOTAL_NAMETABLE_X_TILES,
    heightTiles: TOTAL_NAMETABLE_Y_TILES,
    scale,
    viewportYPx,
    viewportXPx,
    dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
  };
}

// export function createCanvasSize(renderCanvasPositioning: RenderCanvasPositioning): ??? {
//   // TODO
//   // take retina into account.

// }

export function moveRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportSize: ViewportSize
): RenderCanvasPositioning {
  return renderCanvasPositioning;
}

export function zoomIntoRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  zoomOriginViewportCoords: ViewportCoords
): RenderCanvasPositioning {
  return renderCanvasPositioning;
}

export function zoomOutOfRenderCanvas(
  renderCanvasPositioning: RenderCanvasPositioning,
  zoomOriginViewportCoords: ViewportCoords
): RenderCanvasPositioning {
  return renderCanvasPositioning;
}

// Used for tools like pencil to see which tile/pixel the tool should affect
export function convertViewportCoordsToLogicalCoords(
  viewportCoords: ViewportCoords,
  renderCanvasPositioning: RenderCanvasPositioning
): LogicalCoords | null {
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
