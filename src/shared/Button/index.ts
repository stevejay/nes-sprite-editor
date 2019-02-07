import Button from "./Button";
import ButtonContainer from "./ButtonContainer";
import ButtonWithRovingTabIndex from "./ButtonWithRovingTabIndex";

type ButtonFn = typeof Button & {
  Container: typeof ButtonContainer;
  WithRovingTabIndex: typeof ButtonWithRovingTabIndex;
};

const ButtonExport = Button as ButtonFn;
ButtonExport.Container = ButtonContainer;
ButtonExport.WithRovingTabIndex = ButtonWithRovingTabIndex;

export default ButtonExport;
