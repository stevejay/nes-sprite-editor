import PaletteColorInput from "./PaletteColorInput";
import Panel from "./Panel";

type PaletteColorInputType = typeof PaletteColorInput & {
  Container: typeof Panel;
};

const PaletteColorInputExport = PaletteColorInput as PaletteColorInputType;
PaletteColorInputExport.Container = Panel;

export default PaletteColorInputExport;
