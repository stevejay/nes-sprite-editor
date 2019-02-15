import formatByteAsHex from "../format-byte-as-hex";

describe("formatByteAsHex", () => {
  test.each([[0, "00"], [16, "10"], [254, "FE"]])(
    "%o formats to %s",
    (value, expected) => {
      const actual = formatByteAsHex(value);
      expect(actual).toEqual(expected);
    }
  );
});
