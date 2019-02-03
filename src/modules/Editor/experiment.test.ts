import {
  createViewportSize,
  createInitialRenderCanvasPositioning,
  ViewportSize,
  RenderCanvasPositioning,
  Scale,
  convertViewportCoordsToLogicalCoords,
  ViewportCoords,
  LogicalCoords
} from "./experiment";

describe("createViewportSize", () => {
  test.each([
    [1, { widthPx: 256, heightPx: 256 }],
    [2, { widthPx: 512, heightPx: 512 }]
  ])(
    "scaling of %o should equal %o",
    (scaling: 1 | 2, expected: ViewportSize) => {
      const actual = createViewportSize(scaling);
      expect(actual).toEqual(expected);
    }
  );
});

describe("createInitialRenderCanvasPositioning", () => {
  test.each([
    [
      // showing canvas in full in a 256x256 viewport
      { widthPx: 256, heightPx: 256 },
      {
        xTileIndex: 0,
        yTileIndex: 0,
        widthTiles: 32,
        heightTiles: 30,
        scale: 1,
        viewportXPx: 0,
        viewportYPx: 8,
        dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
      }
    ],
    [
      // showing canvas in full in a 384x384 viewport
      { widthPx: 384, heightPx: 384 },
      {
        xTileIndex: 0,
        yTileIndex: 0,
        widthTiles: 32,
        heightTiles: 30,
        scale: 1.5,
        viewportXPx: 0,
        viewportYPx: 12,
        dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
      }
    ],
    [
      // showing canvas in full in a 512x256 viewport
      { widthPx: 512, heightPx: 256 },
      {
        xTileIndex: 0,
        yTileIndex: 0,
        widthTiles: 32,
        heightTiles: 30,
        scale: 1.0666666666666667,
        viewportXPx: 119.46666666666667,
        viewportYPx: 0,
        dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
      }
    ],
    [
      // showing canvas in full in a 256x512 viewport
      { widthPx: 256, heightPx: 512 },
      {
        xTileIndex: 0,
        yTileIndex: 0,
        widthTiles: 32,
        heightTiles: 30,
        scale: 1,
        viewportXPx: 0,
        viewportYPx: 136,
        dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
      }
    ],
    [
      // showing canvas in full in a 512x512 viewport
      { widthPx: 512, heightPx: 512 },
      {
        xTileIndex: 0,
        yTileIndex: 0,
        widthTiles: 32,
        heightTiles: 30,
        scale: 2,
        viewportXPx: 0,
        viewportYPx: 16,
        dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
      }
    ]
  ])(
    "viewport %o",
    (viewportSize: ViewportSize, expected: RenderCanvasPositioning) => {
      const actual = createInitialRenderCanvasPositioning(viewportSize);
      expect(actual).toEqual(expected);
    }
  );
});

describe("convertViewportCoordsToLogicalCoords", () => {
  const INITIAL_POSITION_256x256 = {
    xTileIndex: 0,
    yTileIndex: 0,
    widthTiles: 32,
    heightTiles: 30,
    scale: 1,
    viewportXPx: 0,
    viewportYPx: 8,
    dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
  };

  const INITIAL_POSITION_512x512 = {
    xTileIndex: 0,
    yTileIndex: 0,
    widthTiles: 32,
    heightTiles: 30,
    scale: 2,
    viewportXPx: 0,
    viewportYPx: 16,
    dragBounds: { left: 0, top: 0, right: 0, bottom: 0 }
  };

  test.each([
    [
      "click inside INITIAL_POSITION_256x256 - centralish",
      { x: 100.2, y: 201.3 },
      INITIAL_POSITION_256x256,
      {
        xTileIndex: 12,
        xTilePixelIndex: 4,
        yTileIndex: 24,
        yTilePixelIndex: 1
      }
    ],
    [
      "click inside INITIAL_POSITION_256x256 - top left tile",
      { x: 2, y: 11 },
      INITIAL_POSITION_256x256,
      {
        xTileIndex: 0,
        xTilePixelIndex: 2,
        yTileIndex: 0,
        yTilePixelIndex: 3
      }
    ],
    [
      "click inside INITIAL_POSITION_256x256 - bottom right tile",
      { x: 255, y: 246 },
      INITIAL_POSITION_256x256,
      {
        xTileIndex: 31,
        xTilePixelIndex: 7,
        yTileIndex: 29,
        yTilePixelIndex: 6
      }
    ],
    [
      "click outside INITIAL_POSITION_256x256 - top",
      { x: 1, y: 1 },
      INITIAL_POSITION_256x256,
      null
    ],
    [
      "click outside INITIAL_POSITION_256x256 - bottom",
      { x: 1, y: 255 },
      INITIAL_POSITION_256x256,
      null
    ],
    [
      "click inside INITIAL_POSITION_512x512 - centralish",
      { x: 100.2, y: 201.3 },
      INITIAL_POSITION_512x512,
      {
        xTileIndex: 6,
        xTilePixelIndex: 2,
        yTileIndex: 11,
        yTilePixelIndex: 4
      }
    ],
    [
      "click inside INITIAL_POSITION_512x512 - top left tile",
      { x: 2, y: 17 },
      INITIAL_POSITION_512x512,
      {
        xTileIndex: 0,
        xTilePixelIndex: 1,
        yTileIndex: 0,
        yTilePixelIndex: 0
      }
    ],
    [
      "click inside INITIAL_POSITION_512x512 - bottom right tile",
      { x: 511, y: 492 },
      INITIAL_POSITION_512x512,
      {
        xTileIndex: 31,
        xTilePixelIndex: 7,
        yTileIndex: 29,
        yTilePixelIndex: 6
      }
    ],
    [
      "click outside INITIAL_POSITION_512x512 - top",
      { x: 1, y: 1 },
      INITIAL_POSITION_512x512,
      null
    ],
    [
      "click outside INITIAL_POSITION_512x512 - bottom",
      { x: 1, y: 511 },
      INITIAL_POSITION_512x512,
      null
    ]
  ])(
    "%s",
    (
      _description: string,
      viewportCoords: ViewportCoords,
      renderCanvasPositioning: RenderCanvasPositioning,
      expected: LogicalCoords | null
    ) => {
      const actual = convertViewportCoordsToLogicalCoords(
        viewportCoords,
        renderCanvasPositioning
      );
      expect(actual).toEqual(expected);
    }
  );
});
