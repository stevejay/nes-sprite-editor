import InteractionTracker from "./InteractionTracker";
import Highlight from "./Highlight";
import Container from "./Container";

type TileCanvasExport = {
  InteractionTracker: typeof InteractionTracker;
  Highlight: typeof Highlight;
  Container: typeof Container;
};

const TileCanvas: TileCanvasExport = {
  InteractionTracker,
  Highlight,
  Container
};

export default TileCanvas;
