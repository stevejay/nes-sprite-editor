import Toolbar from "./Toolbar";
import Container from "./Container";

type ToolbarType = typeof Toolbar & { Container: typeof Container };

const ToolbarExport = Toolbar as ToolbarType;
ToolbarExport.Container = Container;

export default ToolbarExport;
