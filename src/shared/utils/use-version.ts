import React from "react";

// Generates a version number, starting at zero, and incrementing it
// whenever the 2nd arg is invoked.
// The returned callback incrementVersion is stable.
export default function useVersion(): [number, () => void] {
  const [version, setVersion] = React.useState(0);
  const incrementVersion = React.useCallback(
    () => setVersion(version => version + 1),
    []
  );
  return [version, incrementVersion];
}
