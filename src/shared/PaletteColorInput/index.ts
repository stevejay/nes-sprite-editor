import PaletteColorInput from "./PaletteColorInput";
import Panel from "./Panel";

type PaletteColorInputFn = typeof PaletteColorInput & {
  Container: typeof Panel;
};

const PaletteColorInputExport = PaletteColorInput as PaletteColorInputFn;
PaletteColorInputExport.Container = Panel;

export default PaletteColorInputExport;
