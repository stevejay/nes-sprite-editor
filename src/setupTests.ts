import "@testing-library/jest-dom/extend-expect";

if (document && !document.createRange) {
  document.createRange = () =>
    (({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: ({
        nodeName: "BODY",
        ownerDocument: document
      } as unknown) as Node
    } as unknown) as Range);
}

// Use an empty export to please Babel's single file emit.
// https://github.com/Microsoft/TypeScript/issues/15230
export {};
