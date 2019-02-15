import selectModalPosition from "../select-modal-position";

describe("selectModalPosition", () => {
  test.each([
    ["no positions", [], null],
    [
      "only 'no fit' positions",
      [
        {
          basicPosition: "left",
          fits: false,
          left: 0,
          top: 10,
          pointer: 50
        },
        {
          basicPosition: "right",
          fits: false,
          left: 0,
          top: 10,
          pointer: 50
        }
      ],
      {
        basicPosition: "left",
        fits: false,
        left: 0,
        top: 10,
        pointer: 50
      }
    ],
    [
      "no central arrow positions in the fitting positions",
      [
        {
          basicPosition: "left",
          fits: true,
          left: 0,
          top: 10,
          pointer: 0
        },
        {
          basicPosition: "right",
          fits: true,
          left: 0,
          top: 10,
          pointer: 0
        }
      ],
      {
        basicPosition: "left",
        fits: true,
        left: 0,
        top: 10,
        pointer: 0
      }
    ],
    [
      "one central arrow position in the fitting positions",
      [
        {
          basicPosition: "left",
          fits: true,
          left: 0,
          top: 10,
          pointer: 0
        },
        {
          basicPosition: "right",
          fits: true,
          left: 0,
          top: 10,
          pointer: 50
        }
      ],
      {
        basicPosition: "right",
        fits: true,
        left: 0,
        top: 10,
        pointer: 50
      }
    ]
  ])("%s", (_label, positions, expected) => {
    const actual = selectModalPosition(positions);
    expect(actual).toEqual(expected);
  });
});
