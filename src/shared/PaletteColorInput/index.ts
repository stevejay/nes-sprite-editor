import PaletteColorInput from "./PaletteColorInput";
import PaletteContainer from "./PaletteContainer";

type PaletteColorInputFn = typeof PaletteColorInput & {
  Container: typeof PaletteContainer;
};

const PaletteColorInputExport = PaletteColorInput as PaletteColorInputFn;
PaletteColorInputExport.Container = PaletteContainer;

export default PaletteColorInputExport;
