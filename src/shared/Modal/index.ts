import useAriaHidden from "./use-aria-hidden";
import usePreventBodyScroll from "./use-prevent-body-scroll";
import ModalBackdrop from "./ModalBackdrop";
import ModalHeader from "./ModalHeader";
import ModalContent from "./ModalContent";
import ModalFooter from "./ModalFooter";
import ModalDialog from "./ModalDialog";
import PointingModalContainer from "./PointingModalContainer";

type ModalDialogFn = typeof ModalDialog & {
  Header: typeof ModalHeader;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
};

const ModalDialogExt = ModalDialog as ModalDialogFn;
ModalDialogExt.Header = ModalHeader;
ModalDialogExt.Content = ModalContent;
ModalDialogExt.Footer = ModalFooter;

export {
  useAriaHidden,
  usePreventBodyScroll,
  ModalBackdrop,
  ModalDialogExt as ModalDialog,
  PointingModalContainer
};
