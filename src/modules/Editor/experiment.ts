export type ViewportCoord = {
  x: number;
  y: number;
};

// gets drawn with transparency svg for background
export type ViewportSize = {
  width: number;
  height: number;
};

export type Scale = 0.5 | 1 | 2 | 4 | 8 | 16;

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
  viewportOffset: LogicalCoord; // logical top left values for canvas style
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
const CANVAS_OVERDRAW_SCALING = 1;

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

export function createInitialRenderCanvasPositioning(
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

export function zoomIntoRenderCanvas(
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

export function zoomOutOfRenderCanvas(
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

export function adjustZoomOfRenderCanvas(
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

export function createRenderCanvasPositioningCenteredOnLogicalCoord(
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

export function convertViewportSizeToLogicalSize(
  viewportSize: ViewportSize,
  scale: Scale
): LogicalSize {
  return {
    widthLogicalPx: Math.floor(viewportSize.width / scale),
    heightLogicalPx: Math.floor(viewportSize.height / scale)
  };
}

// Returned logical coord is relative to logical nametable.
export function convertViewportCoordToLogicalCoord(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportCoord: ViewportCoord
): LogicalCoord {
  const xLogicalPx = Math.floor(
    viewportCoord.x / renderCanvasPositioning.scale
  );
  const yLogicalPx = Math.floor(
    viewportCoord.y / renderCanvasPositioning.scale
  );
  return {
    xLogicalPx:
      renderCanvasPositioning.origin.xLogicalPx -
      renderCanvasPositioning.viewportOffset.xLogicalPx +
      xLogicalPx,
    yLogicalPx:
      renderCanvasPositioning.origin.yLogicalPx -
      renderCanvasPositioning.viewportOffset.yLogicalPx +
      yLogicalPx
  };
}

type FlattenedLogicalCoord = {
  tileIndex: number;
  tilePixelIndex: number;
};

export function convertViewportCoordToNameablePixel(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportCoord: ViewportCoord
): FlattenedLogicalCoord | null {
  const logicalCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    viewportCoord
  );

  const xTileIndex = Math.floor(logicalCoord.xLogicalPx / TILE_SIZE_PIXELS);
  const xTilePixelIndex = logicalCoord.xLogicalPx % TILE_SIZE_PIXELS;
  const yTileIndex = Math.floor(logicalCoord.yLogicalPx / TILE_SIZE_PIXELS);
  const yTilePixelIndex = logicalCoord.yLogicalPx % TILE_SIZE_PIXELS;

  if (
    xTileIndex < 0 ||
    xTileIndex >= TOTAL_NAMETABLE_X_TILES ||
    yTileIndex < 0 ||
    yTileIndex >= TOTAL_NAMETABLE_Y_TILES
  ) {
    return null;
  }

  return {
    tileIndex: yTileIndex * TOTAL_NAMETABLE_X_TILES + xTileIndex,
    tilePixelIndex: yTilePixelIndex * TILE_SIZE_PIXELS + xTilePixelIndex
  };
}

export function convertViewportCoordToNameableMetatile(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportCoord: ViewportCoord
): number | null {
  const logicalCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    viewportCoord
  );

  const metatileSize = TILE_SIZE_PIXELS * 2;
  const totalNametableXMetatiles = TOTAL_NAMETABLE_X_TILES * 0.5;

  const xMetatileIndex = Math.floor(logicalCoord.xLogicalPx / metatileSize);
  const yMetatileIndex = Math.floor(logicalCoord.yLogicalPx / metatileSize);

  if (
    xMetatileIndex < 0 ||
    xMetatileIndex >= totalNametableXMetatiles ||
    yMetatileIndex < 0 ||
    yMetatileIndex >= TOTAL_NAMETABLE_Y_TILES * 0.5
  ) {
    return null;
  }

  return yMetatileIndex * totalNametableXMetatiles + xMetatileIndex;
}

export function isWithinNametable(logicalCoord: LogicalCoord): boolean {
  return (
    logicalCoord.xLogicalPx >= 0 &&
    logicalCoord.xLogicalPx < TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES &&
    logicalCoord.yLogicalPx >= 0 &&
    logicalCoord.yLogicalPx < TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES
  );
}

export function zoomInScale(scale: Scale): Scale {
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

export function zoomOutScale(scale: Scale): Scale {
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

export type TileIndexBounds = {
  xTileIndex: number;
  yTileIndex: number;
  widthInTiles: number;
  heightInTiles: number;
  xTileOffset: number;
  yTileOffset: number;
};

export function createTileIndexBounds(
  renderCanvasPositioning: RenderCanvasPositioning
): TileIndexBounds {
  const xTileIndex = Math.floor(
    renderCanvasPositioning.origin.xLogicalPx / TILE_SIZE_PIXELS
  );

  const yTileIndex = Math.floor(
    renderCanvasPositioning.origin.yLogicalPx / TILE_SIZE_PIXELS
  );

  let widthInTiles = Math.ceil(
    renderCanvasPositioning.size.widthLogicalPx / TILE_SIZE_PIXELS
  );

  let heightInTiles = Math.ceil(
    renderCanvasPositioning.size.heightLogicalPx / TILE_SIZE_PIXELS
  );

  let xTileOffset =
    (renderCanvasPositioning.origin.xLogicalPx % TILE_SIZE_PIXELS) * -1;
  if (xTileOffset === -0) {
    xTileOffset = 0;
  }

  let yTileOffset =
    (renderCanvasPositioning.origin.yLogicalPx % TILE_SIZE_PIXELS) * -1;
  if (yTileOffset === -0) {
    yTileOffset = 0;
  }

  if (xTileOffset < 0) {
    widthInTiles += 1;
  }

  if (xTileIndex + widthInTiles > TOTAL_NAMETABLE_X_TILES) {
    widthInTiles = TOTAL_NAMETABLE_X_TILES - xTileIndex;
  }

  if (yTileOffset < 0) {
    heightInTiles += 1;
  }

  if (yTileIndex + heightInTiles > TOTAL_NAMETABLE_Y_TILES) {
    heightInTiles = TOTAL_NAMETABLE_Y_TILES - yTileIndex;
  }

  return {
    xTileIndex,
    yTileIndex,
    widthInTiles,
    heightInTiles,
    xTileOffset,
    yTileOffset
  };
}
