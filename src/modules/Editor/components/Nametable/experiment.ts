import {
  TILE_SIZE_PIXELS,
  TOTAL_NAMETABLE_X_TILES,
  TOTAL_NAMETABLE_Y_TILES
} from "../../constants";

export type ViewportCoord = {
  x: number;
  y: number;
};

// gets drawn with transparency svg for background
export type ViewportSize = {
  width: number;
  height: number;
};

export type ViewportArea = ViewportCoord & ViewportSize;

export type Scale = 0.5 | 1 | 2 | 4 | 8 | 16;

export type LogicalCoord = {
  xLogicalPx: number;
  yLogicalPx: number;
};

export type LogicalSize = {
  widthLogicalPx: number;
  heightLogicalPx: number;
};

export type TilePosition = {
  tileIndex: number | null;
  metatileIndex: number | null;
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

export function convertViewportCoordToNametableMetatile(
  renderCanvasPositioning: RenderCanvasPositioning,
  viewportCoord: ViewportCoord
): TilePosition {
  const logicalCoord = convertViewportCoordToLogicalCoord(
    renderCanvasPositioning,
    viewportCoord
  );

  const columnIndex = Math.floor(logicalCoord.xLogicalPx / TILE_SIZE_PIXELS);
  const rowIndex = Math.floor(logicalCoord.yLogicalPx / TILE_SIZE_PIXELS);

  if (
    columnIndex < 0 ||
    columnIndex >= TOTAL_NAMETABLE_X_TILES ||
    rowIndex < 0 ||
    rowIndex >= TOTAL_NAMETABLE_Y_TILES
  ) {
    return {
      tileIndex: null,
      metatileIndex: null
    };
  }

  const tileIndex = rowIndex * TOTAL_NAMETABLE_X_TILES + columnIndex;

  return {
    tileIndex,
    metatileIndex:
      Math.floor(rowIndex * 0.5) * (TOTAL_NAMETABLE_X_TILES * 0.5) +
      Math.floor(columnIndex * 0.5)
  };
}

export function convertTilePositionToCanvasCoords(
  renderCanvasPositioning: RenderCanvasPositioning,
  tilePosition: TilePosition,
  useMetatileIndex: boolean
): ViewportArea {
  const index = useMetatileIndex
    ? tilePosition.metatileIndex
    : tilePosition.tileIndex;
  const tileDimension = useMetatileIndex ? 2 : 1;
  const scale = renderCanvasPositioning.scale;
  const dimension = TILE_SIZE_PIXELS * tileDimension * scale;
  const enlargedIndex = index! * tileDimension; // TODO fix !

  const xLogicalPx =
    (enlargedIndex % TOTAL_NAMETABLE_X_TILES) * TILE_SIZE_PIXELS;

  const yLogicalPx =
    Math.floor(enlargedIndex / TOTAL_NAMETABLE_X_TILES) *
    TILE_SIZE_PIXELS *
    tileDimension;

  return {
    x:
      (xLogicalPx -
        renderCanvasPositioning.origin.xLogicalPx +
        renderCanvasPositioning.viewportOffset.xLogicalPx) *
      scale,
    y:
      (yLogicalPx -
        renderCanvasPositioning.origin.yLogicalPx +
        renderCanvasPositioning.viewportOffset.yLogicalPx) *
      scale,
    width: dimension,
    height: dimension
  };
}

export function isWithinNametable(logicalCoord: LogicalCoord): boolean {
  return (
    logicalCoord.xLogicalPx >= 0 &&
    logicalCoord.xLogicalPx < TILE_SIZE_PIXELS * TOTAL_NAMETABLE_X_TILES &&
    logicalCoord.yLogicalPx >= 0 &&
    logicalCoord.yLogicalPx < TILE_SIZE_PIXELS * TOTAL_NAMETABLE_Y_TILES
  );
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
