import PaletteColorInput from "./PaletteColorInput";
import Container from "./Container";

type PaletteColorInputType = typeof PaletteColorInput & {
  Container: typeof Container;
};

const PaletteColorInputExport = PaletteColorInput as PaletteColorInputType;
PaletteColorInputExport.Container = Container;

export default PaletteColorInputExport;
