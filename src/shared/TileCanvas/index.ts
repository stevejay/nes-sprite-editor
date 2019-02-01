import InteractionTracker from "./InteractionTracker";
import Highlight from "./Highlight";
import Container from "./Container";

type TileCanvasFn = {
  InteractionTracker: typeof InteractionTracker;
  Highlight: typeof Highlight;
  Container: typeof Container;
};

const TileCanvasExport: TileCanvasFn = {
  InteractionTracker,
  Highlight,
  Container
};

export default TileCanvasExport;
