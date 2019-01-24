import Button from "./Button";
import ButtonContainer from "./ButtonContainer";

type ButtonFn = typeof Button & { Container: typeof ButtonContainer };

const ButtonExport = Button as ButtonFn;
ButtonExport.Container = ButtonContainer;

export default ButtonExport;
