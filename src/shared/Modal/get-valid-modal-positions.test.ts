import getValidModalPositions, {
  ModalPosition
} from "./get-valid-modal-positions";

type RowCase = [
  string,
  Partial<ClientRect>,
  Partial<ClientRect>,
  number,
  number,
  Array<ModalPosition>
];

describe("getValidModalPositions", () => {
  test.each([
    [
      "top left target",
      { top: 0, left: 0, bottom: 20, right: 60 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: true,
          left: 60 + 6,
          top: 0,
          pointer: 12
        },
        {
          basicPosition: "left",
          fits: false,
          left: 0 - 200 - 6,
          top: 0,
          pointer: 12
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 0,
          top: 20 + 6,
          pointer: 15
        },
        {
          basicPosition: "top",
          fits: false,
          left: 0,
          top: 0 - 100 - 6,
          pointer: 15
        }
      ]
    ],
    [
      "top middle target",
      { top: 0, left: 270, bottom: 20, right: 330 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: true,
          left: 330 + 6,
          top: 0,
          pointer: 12
        },
        {
          basicPosition: "left",
          fits: true,
          left: 270 - 200 - 6,
          top: 0,
          pointer: 12
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 300 - 100,
          top: 20 + 6,
          pointer: 50
        },
        {
          basicPosition: "top",
          fits: false,
          left: 300 - 100,
          top: 0 - 100 - 6,
          pointer: 50
        }
      ]
    ],
    [
      "top right target",
      { top: 0, left: 540, bottom: 20, right: 600 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: false,
          left: 600 + 6,
          top: 0,
          pointer: 12
        },
        {
          basicPosition: "left",
          fits: true,
          left: 540 - 200 - 6,
          top: 0,
          pointer: 12
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 600 - 200,
          top: 20 + 6,
          pointer: 85
        },
        {
          basicPosition: "top",
          fits: false,
          left: 600 - 200,
          top: 0 - 100 - 6,
          pointer: 85
        }
      ]
    ],
    [
      "middle left target",
      { top: 240, left: 0, bottom: 260, right: 60 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: true,
          left: 60 + 6,
          top: 250 - 50,
          pointer: 50
        },
        {
          basicPosition: "left",
          fits: false,
          left: 0 - 200 - 6,
          top: 250 - 50,
          pointer: 50
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 0,
          top: 260 + 6,
          pointer: 15
        },
        {
          basicPosition: "top",
          fits: true,
          left: 0,
          top: 240 - 100 - 6,
          pointer: 15
        }
      ]
    ],
    [
      "middle middle target",
      { top: 240, left: 270, bottom: 260, right: 330 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: true,
          left: 330 + 6,
          top: 250 - 50,
          pointer: 50
        },
        {
          basicPosition: "left",
          fits: true,
          left: 270 - 200 - 6,
          top: 250 - 50,
          pointer: 50
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 300 - 100,
          top: 260 + 6,
          pointer: 50
        },
        {
          basicPosition: "top",
          fits: true,
          left: 300 - 100,
          top: 240 - 100 - 6,
          pointer: 50
        }
      ]
    ],
    [
      "middle right target",
      { top: 240, left: 540, bottom: 260, right: 600 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: false,
          left: 600 + 6,
          top: 250 - 50,
          pointer: 50
        },
        {
          basicPosition: "left",
          fits: true,
          left: 540 - 200 - 6,
          top: 250 - 50,
          pointer: 50
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 600 - 200,
          top: 260 + 6,
          pointer: 85
        },
        {
          basicPosition: "top",
          fits: true,
          left: 600 - 200,
          top: 240 - 100 - 6,
          pointer: 85
        }
      ]
    ],
    [
      "bottom left target",
      { top: 480, left: 0, bottom: 500, right: 60 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: true,
          left: 60 + 6,
          top: 500 - 100,
          pointer: 88
        },
        {
          basicPosition: "left",
          fits: false,
          left: 0 - 200 - 6,
          top: 500 - 100,
          pointer: 88
        },
        {
          basicPosition: "bottom",
          fits: false,
          left: 0,
          top: 500 + 6,
          pointer: 15
        },
        {
          basicPosition: "top",
          fits: true,
          left: 0,
          top: 480 - 100 - 6,
          pointer: 15
        }
      ]
    ],
    [
      "bottom middle target",
      { top: 480, left: 270, bottom: 500, right: 330 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: true,
          left: 330 + 6,
          top: 500 - 100,
          pointer: 88
        },
        {
          basicPosition: "left",
          fits: true,
          left: 270 - 200 - 6,
          top: 500 - 100,
          pointer: 88
        },
        {
          basicPosition: "bottom",
          fits: false,
          left: 300 - 100,
          top: 500 + 6,
          pointer: 50
        },
        {
          basicPosition: "top",
          fits: true,
          left: 300 - 100,
          top: 480 - 100 - 6,
          pointer: 50
        }
      ]
    ],
    [
      "bottom right target",
      { top: 480, left: 540, bottom: 500, right: 600 },
      { top: 0, left: 0, bottom: 500, right: 600 },
      200,
      100,
      [
        {
          basicPosition: "right",
          fits: false,
          left: 600 + 6,
          top: 500 - 100,
          pointer: 88
        },
        {
          basicPosition: "left",
          fits: true,
          left: 540 - 200 - 6,
          top: 500 - 100,
          pointer: 88
        },
        {
          basicPosition: "bottom",
          fits: false,
          left: 600 - 200,
          top: 500 + 6,
          pointer: 85
        },
        {
          basicPosition: "top",
          fits: true,
          left: 600 - 200,
          top: 480 - 100 - 6,
          pointer: 85
        }
      ]
    ]
  ] as Array<RowCase>)(
    "test %s",
    (
      _label,
      targetClientRect,
      containerClientRect,
      modalWidth,
      modalHeight,
      expected
    ) => {
      const actual = getValidModalPositions(
        targetClientRect,
        containerClientRect,
        modalWidth,
        modalHeight,
        12
      );
      expect(actual).toEqual(expected);
    }
  );
});
