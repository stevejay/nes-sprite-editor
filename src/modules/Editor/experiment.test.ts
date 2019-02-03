import deepFreeze from "@ef-carbon/deep-freeze";
import {
  createViewportSize,
  createInitialRenderCanvasPositioning,
  ViewportSize,
  RenderCanvasPositioning,
  convertViewportCoordsToLogicalCoords,
  ViewportCoord,
  LogicalCoord,
  ViewportScale
} from "./experiment";

// scale 1 = 16 tiles max border width = 1 * 8 * 16 = 128px border
// scale 2 = 8 tiles max border width = 2 * 8 * 8 = 128px border
// scale 4 = 4 tiles max border width = 4 * 8 * 4 = 128px border
//
// = 16 / scale = max tiles border width, but min is 1 tile.

const INITIAL_POSITION_256x256: RenderCanvasPositioning = deepFreeze({
  xTileIndex: 0,
  yTileIndex: 0,
  widthTiles: 32 + 0 + 0,
  heightTiles: 30 + 0 + 0,
  scale: 1,
  viewportXPx: 0,
  viewportYPx: 8
});

const ZOOMED_INTO_TOP_LEFT_256x256: RenderCanvasPositioning = deepFreeze({
  xTileIndex: 0,
  yTileIndex: 0,
  widthTiles: 16 + 0 + 8,
  heightTiles: 16 + 0 + 8,
  scale: 2,
  viewportXPx: 0,
  viewportYPx: 0
});

const ZOOMED_INTO_JUST_OUTSIDE_TOP_LEFT_256x256: RenderCanvasPositioning = deepFreeze(
  {
    xTileIndex: 0,
    yTileIndex: 0,
    widthTiles: 16 + 0 + 8,
    heightTiles: 16 + 0 + 8,
    scale: 2,
    viewportLogicalCoord: {
      xTileIndex: -1,
      xTilePixelIndex: 4,
      yTileIndex: -1,
      yTilePixelIndex: 3
    }
    // viewportXPx: 4,
    // viewportYPx: 4
  }
);

const ZOOMED_INTO_ALMOST_TOP_LEFT_256x256: RenderCanvasPositioning = deepFreeze(
  {
    xTileIndex: 0,
    yTileIndex: 0,
    widthTiles: 16 + 0 + 9,
    heightTiles: 16 + 0 + 9,
    scale: 2,
    viewportLogicalCoord: {
      xTileIndex: 0,
      xTilePixelIndex: 4,
      yTileIndex: 0,
      yTilePixelIndex: 3
    }
    // viewportXPx: 4,
    // viewportYPx: 4
  }
);

const ZOOMED_INTO_NEARLY_TOP_LEFT_256x256: RenderCanvasPositioning = deepFreeze(
  {
    xTileIndex: 4 - 4,
    yTileIndex: 4 - 4,
    widthTiles: 16 + 4 + 8,
    heightTiles: 16 + 4 + 8,
    scale: 2,
    viewportXPx: -4 * (8 * 2) + 5 * 2, // 4 tiles 5 pixels to left
    viewportYPx: -4 * (8 * 2) + 6 * 2 // 4 tiles 6 pixels to top
  }
);

const ZOOMED_INTO_BOTTOM_RIGHT_256x256: RenderCanvasPositioning = deepFreeze({
  xTileIndex: 16 - 8,
  yTileIndex: 14 - 8,
  widthTiles: 16 + 8 + 0,
  heightTiles: 16 + 8 + 0,
  scale: 2,
  viewportXPx: -8 * (8 * 2), // 8 tiles to left
  viewportYPx: -8 * (8 * 2) // 8 tiles to top
});
// what happens when we're one off bottom right?

const ZOOMED_INTO_CENTRE_256x256: RenderCanvasPositioning = deepFreeze({
  xTileIndex: 8 - 8,
  yTileIndex: 7 - 7,
  widthTiles: 16 + 8 + 8,
  heightTiles: 16 + 7 + 7,
  scale: 2,
  viewportXPx: -8 * (8 * 2) + 5 * 2, // 8 tiles 5 pixels to left
  viewportYPx: -7 * (8 * 2) + 6 * 2 // 7 tiles 6 pixels to top
});

const ZOOMED_INTO_NEARLY_BOTTOM_RIGHT_256x256: RenderCanvasPositioning = deepFreeze(
  {
    xTileIndex: 14 - 8,
    yTileIndex: 12 - 8,
    widthTiles: 16 + 8 + 2,
    heightTiles: 16 + 8 + 2,
    scale: 2,
    viewportXPx: -8 * (8 * 2) + 5 * 2, // 8 tiles 5 pixels to left
    viewportYPx: -8 * (8 * 2) + 6 * 2 // 8 tiles 6 pixels to top
  }
);

const INITIAL_POSITION_512x512: RenderCanvasPositioning = deepFreeze({
  xTileIndex: 0,
  yTileIndex: 0,
  widthTiles: 32,
  heightTiles: 30,
  scale: 2,
  viewportXPx: 0,
  viewportYPx: 8 * 2
});

const ZOOMED_INTO_TOP_LEFT_512x512 = deepFreeze({
  xTileIndex: 0,
  yTileIndex: 0,
  widthTiles: 16 + 4,
  heightTiles: 16 + 4,
  scale: 4,
  viewportXPx: 0,
  viewportYPx: 0
});

const ZOOMED_INTO_BOTTOM_RIGHT_512x512 = deepFreeze({
  xTileIndex: 16 - 4,
  yTileIndex: 16 - 4,
  widthTiles: 16 + 4,
  heightTiles: 16 + 4,
  scale: 4,
  viewportXPx: -4 * (8 * 4), // 4 tiles to left
  viewportYPx: -4 * (8 * 4) // 4 tiles to top
});

describe("createViewportSize", () => {
  test.each([
    [1, { widthPx: 256, heightPx: 256 }],
    [2, { widthPx: 512, heightPx: 512 }]
  ])("scale is %o", (scale: ViewportScale, expected: ViewportSize) => {
    const actual = createViewportSize(scale);
    expect(actual).toEqual(expected);
  });
});

describe("createInitialRenderCanvasPositioning", () => {
  test.each([
    [
      // showing canvas in full in a 256x256 viewport
      { widthPx: 256, heightPx: 256 },
      {
        xTileIndex: 0,
        yTileIndex: 0,
        widthInTiles: 32,
        heightTIniles: 30,
        scale: 1,
        viewportXPx: 0,
        viewportYPx: 8
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
        viewportYPx: 12
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
        viewportYPx: 0
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
        viewportYPx: 136
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
        viewportYPx: 16
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
      viewportCoords: ViewportCoord,
      renderCanvasPositioning: RenderCanvasPositioning,
      expected: LogicalCoord | null
    ) => {
      const actual = convertViewportCoordsToLogicalCoords(
        viewportCoords,
        renderCanvasPositioning
      );
      expect(actual).toEqual(expected);
    }
  );
});
