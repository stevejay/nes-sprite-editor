import deepFreeze from "@ef-carbon/deep-freeze";
import {
  createInitialRenderCanvasPositioning,
  ViewportSize,
  RenderCanvasPositioning,
  ViewportCoord,
  LogicalCoord,
  Scale,
  zoomInScale,
  zoomOutScale,
  isWithinNametable,
  LogicalSize,
  convertViewportSizeToLogicalSize,
  convertViewportCoordToLogicalCoord,
  createRenderCanvasPositioningCenteredOnLogicalCoord,
  calculateBestNaturalScaleForViewportSize,
  TileIndexBounds,
  createTileIndexBounds,
  adjustZoomOfRenderCanvas
} from "./experiment";

const VIEWPORT_256x256 = deepFreeze({ width: 256, height: 256 });
const VIEWPORT_512x512 = deepFreeze({ width: 512, height: 512 });

const INITIAL_POSITION_256x256: RenderCanvasPositioning = deepFreeze({
  origin: {
    xLogicalPx: 0,
    yLogicalPx: 0
  },
  size: {
    widthLogicalPx: 8 * 32,
    heightLogicalPx: 8 * 30
  },
  scale: 1,
  viewportOffset: {
    xLogicalPx: 0,
    yLogicalPx: 8
  }
} as RenderCanvasPositioning);

const ZOOMED_INTO_TOP_LEFT_256x256: RenderCanvasPositioning = deepFreeze({
  origin: {
    xLogicalPx: 0,
    yLogicalPx: 0
  },
  size: {
    widthLogicalPx: 8 * 32,
    heightLogicalPx: 8 * 30
  },
  scale: 2,
  viewportOffset: {
    xLogicalPx: 0,
    yLogicalPx: 0
  }
} as RenderCanvasPositioning);

const ZOOMED_INTO_OUTSIDE_TOP_LEFT_256x256: RenderCanvasPositioning = deepFreeze(
  {
    origin: {
      xLogicalPx: 0,
      yLogicalPx: 0
    },
    size: {
      widthLogicalPx: 8 * 30, // ?
      heightLogicalPx: 8 * 28 // ?
    },
    scale: 2,
    viewportOffset: {
      xLogicalPx: 16,
      yLogicalPx: 16
    }
  } as RenderCanvasPositioning
);

const ZOOMED_INTO_BOTTOM_RIGHT_256x256: RenderCanvasPositioning = deepFreeze({
  origin: {
    xLogicalPx: 0,
    yLogicalPx: 0
  },
  size: {
    widthLogicalPx: 8 * 32,
    heightLogicalPx: 8 * 30
  },
  scale: 2,
  viewportOffset: {
    xLogicalPx: -8 * 16,
    yLogicalPx: -8 * 14
  }
} as RenderCanvasPositioning);

const INITIAL_POSITION_512x512: RenderCanvasPositioning = deepFreeze({
  origin: {
    xLogicalPx: 0,
    yLogicalPx: 0
  },
  size: {
    widthLogicalPx: 8 * 32,
    heightLogicalPx: 8 * 30
  },
  scale: 2,
  viewportOffset: {
    xLogicalPx: 0,
    yLogicalPx: 8
  }
} as RenderCanvasPositioning);

const ZOOMED_INTO_TOP_LEFT_512x512 = deepFreeze({
  origin: {
    xLogicalPx: 0,
    yLogicalPx: 0
  },
  size: {
    widthLogicalPx: 8 * 32,
    heightLogicalPx: 8 * 30
  },
  scale: 4,
  viewportOffset: {
    xLogicalPx: 0,
    yLogicalPx: 0
  }
});

const ZOOMED_INTO_BOTTOM_RIGHT_512x512 = deepFreeze({
  origin: {
    xLogicalPx: 0,
    yLogicalPx: 0
  },
  size: {
    widthLogicalPx: 8 * 32,
    heightLogicalPx: 8 * 30
  },
  scale: 4,
  viewportOffset: {
    xLogicalPx: -8 * 16,
    yLogicalPx: -8 * 14
  }
});

/*

describe("calculateBestNaturalScaleForViewportSize", () => {
  test.each([[VIEWPORT_256x256, 1], [VIEWPORT_512x512, 2]])(
    "%o",
    (viewportSize: ViewportSize, expected: Scale) => {
      const actual = calculateBestNaturalScaleForViewportSize(viewportSize);
      expect(actual).toEqual(expected);
    }
  );
});

describe("zoomInScale", () => {
  test.each([[0.5, 1], [1.06666, 2], [2, 4], [4, 8], [8, 16], [20, 20]])(
    "scale is %o",
    (scale: Scale, expected: Scale) => {
      const actual = zoomInScale(scale);
      expect(actual).toEqual(expected);
    }
  );
});

describe("zoomOutScale", () => {
  test.each([
    [0.2, 0.2],
    [1, 0.5],
    [1.06666, 1],
    [2, 1],
    [4, 2],
    [8, 4],
    [16, 8],
    [20, 8]
  ])("scale is %o", (scale: Scale, expected: Scale) => {
    const actual = zoomOutScale(scale);
    expect(actual).toEqual(expected);
  });
});

describe("isWithinNametable", () => {
  test.each([
    [{ xLogicalPx: -1, yLogicalPx: -1 }, false],
    [{ xLogicalPx: -1, yLogicalPx: 0 }, false],
    [{ xLogicalPx: 0, yLogicalPx: -1 }, false],
    [{ xLogicalPx: 0, yLogicalPx: 0 }, true],
    [{ xLogicalPx: 1, yLogicalPx: 1 }, true],
    [{ xLogicalPx: 254, yLogicalPx: 238 }, true],
    [{ xLogicalPx: 255, yLogicalPx: 239 }, true],
    [{ xLogicalPx: 256, yLogicalPx: 239 }, false],
    [{ xLogicalPx: 255, yLogicalPx: 240 }, false]
  ])("logical coord is %o", (logicalCoord: LogicalCoord, expected: boolean) => {
    const actual = isWithinNametable(logicalCoord);
    expect(actual).toEqual(expected);
  });
});

describe("convertViewportSizeToLogicalSize", () => {
  test.each([
    [VIEWPORT_256x256, 1, { widthLogicalPx: 256, heightLogicalPx: 256 }],
    [VIEWPORT_256x256, 2, { widthLogicalPx: 128, heightLogicalPx: 128 }],
    [
      { width: 256, height: 512 },
      1,
      { widthLogicalPx: 256, heightLogicalPx: 512 }
    ],
    [
      { width: 256, height: 512 },
      2,
      { widthLogicalPx: 128, heightLogicalPx: 256 }
    ]
  ])(
    "viewport size is %o and scale is %o",
    (viewportSize: ViewportSize, scale: Scale, expected: LogicalSize) => {
      const actual = convertViewportSizeToLogicalSize(viewportSize, scale);
      expect(actual).toEqual(expected);
    }
  );
});

describe("convertViewportCoordToLogicalCoord", () => {
  test.each([
    // special test
    [
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      },
      { x: 256, y: 256 },
      { xLogicalPx: 128, yLogicalPx: 120 }
    ],
    // INITIAL_POSITION_256x256 variations:
    [
      INITIAL_POSITION_256x256,
      { x: 0, y: 0 },
      { xLogicalPx: 0, yLogicalPx: -8 }
    ],
    [
      INITIAL_POSITION_256x256,
      { x: 0, y: 8 },
      { xLogicalPx: 0, yLogicalPx: 0 }
    ],
    [
      INITIAL_POSITION_256x256,
      { x: 0, y: 12 },
      { xLogicalPx: 0, yLogicalPx: 4 }
    ],
    [
      INITIAL_POSITION_256x256,
      { x: 255, y: 239 + 8 },
      { xLogicalPx: 255, yLogicalPx: 239 }
    ],
    [
      INITIAL_POSITION_256x256,
      { x: 256, y: 239 + 9 },
      { xLogicalPx: 256, yLogicalPx: 240 }
    ],
    // ZOOMED_INTO_TOP_LEFT_256x256 variations:
    [
      ZOOMED_INTO_TOP_LEFT_256x256,
      { x: 9, y: 10 },
      { xLogicalPx: 4, yLogicalPx: 5 }
    ],
    // ZOOMED_INTO_BOTTOM_RIGHT_256x256 variations
    [
      ZOOMED_INTO_BOTTOM_RIGHT_256x256,
      { x: 9, y: 10 },
      { xLogicalPx: 132, yLogicalPx: 117 }
    ],
    [
      ZOOMED_INTO_BOTTOM_RIGHT_256x256,
      { x: 255, y: 253 },
      { xLogicalPx: 255, yLogicalPx: 238 }
    ],
    // ZOOMED_INTO_OUTSIDE_TOP_LEFT_256x256 variations:
    [
      ZOOMED_INTO_OUTSIDE_TOP_LEFT_256x256,
      { x: 3, y: 0 },
      { xLogicalPx: -15, yLogicalPx: -16 }
    ],
    // INITIAL_POSITION_512x512 variations:
    [
      INITIAL_POSITION_512x512,
      { x: 0, y: 0 },
      { xLogicalPx: 0, yLogicalPx: -8 }
    ],
    [
      INITIAL_POSITION_512x512,
      { x: 256, y: 256 },
      { xLogicalPx: 128, yLogicalPx: 120 }
    ],
    [
      INITIAL_POSITION_512x512,
      { x: 1, y: 8 },
      { xLogicalPx: 0, yLogicalPx: -4 }
    ],
    [
      INITIAL_POSITION_512x512,
      { x: 0, y: 16 },
      { xLogicalPx: 0, yLogicalPx: 0 }
    ],
    [
      INITIAL_POSITION_512x512,
      { x: 7, y: 20 },
      { xLogicalPx: 3, yLogicalPx: 2 }
    ],
    [
      INITIAL_POSITION_512x512,
      { x: 511, y: 479 + 16 },
      { xLogicalPx: 255, yLogicalPx: 239 }
    ],
    [
      INITIAL_POSITION_512x512,
      { x: 512, y: 480 + 16 },
      { xLogicalPx: 256, yLogicalPx: 240 }
    ],
    // ZOOMED_INTO_TOP_LEFT_512x512 variations:
    [
      ZOOMED_INTO_TOP_LEFT_512x512,
      { x: 0, y: 6 },
      { xLogicalPx: 0, yLogicalPx: 1 }
    ],
    [
      ZOOMED_INTO_TOP_LEFT_512x512,
      { x: 511, y: 511 },
      { xLogicalPx: 127, yLogicalPx: 127 }
    ],
    // ZOOMED_INTO_BOTTOM_RIGHT_512x512
    [
      ZOOMED_INTO_BOTTOM_RIGHT_512x512,
      { x: 6, y: 0 },
      { xLogicalPx: 129, yLogicalPx: 112 }
    ],
    [
      ZOOMED_INTO_BOTTOM_RIGHT_512x512,
      { x: 511, y: 511 },
      { xLogicalPx: 255, yLogicalPx: 239 }
    ]
  ])(
    "positioning is %o and coord is %o",
    (
      renderCanvasPositioning: RenderCanvasPositioning,
      viewportCoord: ViewportCoord,
      expected: LogicalCoord
    ) => {
      const actual = convertViewportCoordToLogicalCoord(
        renderCanvasPositioning,
        viewportCoord
      );
      expect(actual).toEqual(expected);
    }
  );
});

describe("createInitialRenderCanvasPositioning", () => {
  test.each([
    [
      // showing canvas in full in a 256x256 viewport
      VIEWPORT_256x256,
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      }
    ],
    [
      // showing canvas in full in a 384x384 viewport
      { width: 384, height: 384 },
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 64,
          yLogicalPx: 72
        }
      }
    ],
    [
      // showing canvas in full in a 512x256 viewport
      { width: 512, height: 256 },
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 128,
          yLogicalPx: 8
        }
      }
    ],
    [
      // showing canvas in full in a 256x512 viewport
      { width: 256, height: 512 },
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 136
        }
      }
    ],
    [
      // showing canvas in full in a 512x512 viewport
      VIEWPORT_512x512,
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
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

describe("createRenderCanvasPositioningCenteredOnLogicalCoord", () => {
  test.each([
    [
      // 512x512 viewport, at scale 2 (so all canvas visible):
      { xLogicalPx: 128, yLogicalPx: 120 }, // should be current viewport center
      VIEWPORT_512x512,
      2,
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      }
    ],
    // 256x256 viewport, at scale 1 (so all canvas visible):
    [
      { xLogicalPx: 128, yLogicalPx: 120 },
      VIEWPORT_256x256,
      1,
      {
        origin: { xLogicalPx: 0, yLogicalPx: 0 },
        size: { widthLogicalPx: 256, heightLogicalPx: 240 },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      }
    ],
    [
      { xLogicalPx: 0, yLogicalPx: 0 },
      VIEWPORT_256x256,
      1,
      {
        origin: { xLogicalPx: 0, yLogicalPx: 0 },
        size: { widthLogicalPx: 256, heightLogicalPx: 240 },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 128,
          yLogicalPx: 128
        }
      }
    ],
    [
      { xLogicalPx: 0, yLogicalPx: -8 },
      VIEWPORT_256x256,
      1,
      {
        origin: { xLogicalPx: 0, yLogicalPx: 0 },
        size: { widthLogicalPx: 256, heightLogicalPx: 240 },
        scale: 1,
        viewportOffset: {
          xLogicalPx: 128,
          yLogicalPx: 136
        }
      }
    ],
    [
      { xLogicalPx: 255, yLogicalPx: 239 },
      VIEWPORT_256x256,
      1,
      {
        origin: { xLogicalPx: 0, yLogicalPx: 0 },
        size: { widthLogicalPx: 256, heightLogicalPx: 240 },
        scale: 1,
        viewportOffset: {
          xLogicalPx: -127,
          yLogicalPx: -111
        }
      }
    ]
  ])(
    "logicalCoord=%o, viewportSize=%o, scale=%o",
    (
      logicalCoord: LogicalCoord,
      viewportSize: ViewportSize,
      scale: Scale,
      expected: RenderCanvasPositioning
    ) => {
      const actual = createRenderCanvasPositioningCenteredOnLogicalCoord(
        logicalCoord,
        viewportSize,
        scale
      );
      expect(actual).toEqual(expected);
    }
  );
});

describe("createTileIndexBounds", () => {
  test.each([
    // TODO
  ])(
    "%o",
    (
      renderCanvasPositioning: RenderCanvasPositioning,
      expected: TileIndexBounds
    ) => {
      const actual = createTileIndexBounds(renderCanvasPositioning);
      expect(actual).toEqual(expected);
    }
  );
});

describe("adjustZoomOfRenderCanvas", () => {
  test.each([
    // No-op scale change
    [
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      },
      VIEWPORT_512x512,
      2,
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      }
    ],
    // 2 > 4 scale change
    [
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256,
          heightLogicalPx: 240
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 8
        }
      },
      VIEWPORT_512x512,
      4,
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 128,
          heightLogicalPx: 128
        },
        scale: 4,
        viewportOffset: {
          xLogicalPx: -64,
          yLogicalPx: -72
        }
      }
    ]
  ])(
    "%o with viewport %o and newScale %o",
    (
      renderCanvasPositioning: RenderCanvasPositioning,
      viewportSize: ViewportSize,
      newScale: Scale,
      expected: RenderCanvasPositioning
    ) => {
      const actual = adjustZoomOfRenderCanvas(
        renderCanvasPositioning,
        viewportSize,
        newScale
      );
      expect(actual).toEqual(expected);
    }
  );
});
*/

describe("temp - adjustZoomOfRenderCanvas", () => {
  test.each([
    // 4 > 2 scale change
    [
      {
        origin: {
          xLogicalPx: 64,
          yLogicalPx: 56
        },
        size: {
          widthLogicalPx: 128,
          heightLogicalPx: 128
        },
        scale: 4,
        viewportOffset: {
          xLogicalPx: 0,
          yLogicalPx: 0
        }
      },
      VIEWPORT_512x512,
      2,
      {
        origin: {
          xLogicalPx: 0,
          yLogicalPx: 0
        },
        size: {
          widthLogicalPx: 256, // wrong
          heightLogicalPx: 240 // wrong
        },
        scale: 2,
        viewportOffset: {
          xLogicalPx: 0, // wrong
          yLogicalPx: 8 // wrong
        }
      }
    ]
  ])(
    "%o with viewport %o and newScale %o",
    (
      renderCanvasPositioning: RenderCanvasPositioning,
      viewportSize: ViewportSize,
      newScale: Scale,
      expected: RenderCanvasPositioning
    ) => {
      const actual = adjustZoomOfRenderCanvas(
        renderCanvasPositioning,
        viewportSize,
        newScale
      );
      expect(actual).toEqual(expected);
    }
  );
});
