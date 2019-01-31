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
          basicPosition: "left",
          fits: false,
          left: 0 - 200,
          top: 0,
          pointerLeft: 200,
          pointerTop: 10
        },
        {
          basicPosition: "right",
          fits: true,
          left: 60,
          top: 0,
          pointerLeft: 0,
          pointerTop: 10
        },
        {
          basicPosition: "top",
          fits: false,
          left: 0,
          top: 0 - 100,
          pointerLeft: 30,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 0,
          top: 20,
          pointerLeft: 30,
          pointerTop: 0
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
          basicPosition: "left",
          fits: true,
          left: 270 - 200,
          top: 0,
          pointerLeft: 200,
          pointerTop: 10
        },
        {
          basicPosition: "right",
          fits: true,
          left: 330,
          top: 0,
          pointerLeft: 0,
          pointerTop: 10
        },
        {
          basicPosition: "top",
          fits: false,
          left: 300 - 100,
          top: 0 - 100,
          pointerLeft: 100,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 300 - 100,
          top: 20,
          pointerLeft: 100,
          pointerTop: 0
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
          basicPosition: "left",
          fits: true,
          left: 540 - 200,
          top: 0,
          pointerLeft: 200,
          pointerTop: 10
        },
        {
          basicPosition: "right",
          fits: false,
          left: 600,
          top: 0,
          pointerLeft: 0,
          pointerTop: 10
        },
        {
          basicPosition: "top",
          fits: false,
          left: 600 - 200,
          top: 0 - 100,
          pointerLeft: 200 - 30,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 600 - 200,
          top: 20,
          pointerLeft: 200 - 30,
          pointerTop: 0
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
          basicPosition: "left",
          fits: false,
          left: 0 - 200,
          top: 250 - 50,
          pointerLeft: 200,
          pointerTop: 50
        },
        {
          basicPosition: "right",
          fits: true,
          left: 60,
          top: 250 - 50,
          pointerLeft: 0,
          pointerTop: 50
        },
        {
          basicPosition: "top",
          fits: true,
          left: 0,
          top: 240 - 100,
          pointerLeft: 30,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 0,
          top: 260,
          pointerLeft: 30,
          pointerTop: 0
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
          basicPosition: "left",
          fits: true,
          left: 270 - 200,
          top: 250 - 50,
          pointerLeft: 200,
          pointerTop: 50
        },
        {
          basicPosition: "right",
          fits: true,
          left: 330,
          top: 250 - 50,
          pointerLeft: 0,
          pointerTop: 50
        },
        {
          basicPosition: "top",
          fits: true,
          left: 300 - 100,
          top: 240 - 100,
          pointerLeft: 100,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 300 - 100,
          top: 260,
          pointerLeft: 100,
          pointerTop: 0
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
          basicPosition: "left",
          fits: true,
          left: 540 - 200,
          top: 250 - 50,
          pointerLeft: 200,
          pointerTop: 50
        },
        {
          basicPosition: "right",
          fits: false,
          left: 600,
          top: 250 - 50,
          pointerLeft: 0,
          pointerTop: 50
        },
        {
          basicPosition: "top",
          fits: true,
          left: 600 - 200,
          top: 240 - 100,
          pointerLeft: 200 - 30,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: true,
          left: 600 - 200,
          top: 260,
          pointerLeft: 200 - 30,
          pointerTop: 0
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
          basicPosition: "left",
          fits: false,
          left: 0 - 200,
          top: 500 - 100,
          pointerLeft: 200,
          pointerTop: 90
        },
        {
          basicPosition: "right",
          fits: true,
          left: 60,
          top: 500 - 100,
          pointerLeft: 0,
          pointerTop: 90
        },
        {
          basicPosition: "top",
          fits: true,
          left: 0,
          top: 480 - 100,
          pointerLeft: 30,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: false,
          left: 0,
          top: 500,
          pointerLeft: 30,
          pointerTop: 0
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
          basicPosition: "left",
          fits: true,
          left: 270 - 200,
          top: 500 - 100,
          pointerLeft: 200,
          pointerTop: 90
        },
        {
          basicPosition: "right",
          fits: true,
          left: 330,
          top: 500 - 100,
          pointerLeft: 0,
          pointerTop: 90
        },
        {
          basicPosition: "top",
          fits: true,
          left: 300 - 100,
          top: 480 - 100,
          pointerLeft: 100,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: false,
          left: 300 - 100,
          top: 500,
          pointerLeft: 100,
          pointerTop: 0
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
          basicPosition: "left",
          fits: true,
          left: 540 - 200,
          top: 500 - 100,
          pointerLeft: 200,
          pointerTop: 90
        },
        {
          basicPosition: "right",
          fits: false,
          left: 600,
          top: 500 - 100,
          pointerLeft: 0,
          pointerTop: 90
        },
        {
          basicPosition: "top",
          fits: true,
          left: 600 - 200,
          top: 480 - 100,
          pointerLeft: 200 - 30,
          pointerTop: 100
        },
        {
          basicPosition: "bottom",
          fits: false,
          left: 600 - 200,
          top: 500,
          pointerLeft: 200 - 30,
          pointerTop: 0
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
        modalHeight
      );
      expect(actual).toEqual(expected);
    }
  );
});
