import RadioInput from "./RadioInput";
import RadioInputGroup from "./RadioInputGroup";

type RadioInputType = typeof RadioInput & { Group: typeof RadioInputGroup };

const RadioInputExport = RadioInput as RadioInputType;
RadioInputExport.Group = RadioInputGroup;

export default RadioInputExport;
