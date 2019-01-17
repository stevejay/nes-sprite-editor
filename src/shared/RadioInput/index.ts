import RadioInput from "./RadioInput";
import RadioInputGroup from "./RadioInputGroup";

type RadioInputFn = typeof RadioInput & { Group: typeof RadioInputGroup };

const RadioInputExport = RadioInput as RadioInputFn;
RadioInputExport.Group = RadioInputGroup;

export default RadioInputExport;
