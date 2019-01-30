import Button from "./Button";
import SubmitButton from "./SubmitButton";
import ButtonContainer from "./ButtonContainer";

type ButtonFn = typeof Button & {
  Container: typeof ButtonContainer;
  Submit: typeof SubmitButton;
};

const ButtonExport = Button as ButtonFn;
ButtonExport.Container = ButtonContainer;
ButtonExport.Submit = SubmitButton;

export default ButtonExport;
