import useAriaHidden from "./use-aria-hidden";
import usePreventBodyScroll from "./use-prevent-body-scroll";
import ModalBackdrop from "./ModalBackdrop";
import ModalHeader from "./ModalHeader";
import ModalContent from "./ModalContent";
import ModalFooter from "./ModalFooter";
import ModalDialog from "./ModalDialog";
import PointingModalContainer from "./PointingModalContainer";

type ModalDialogType = typeof ModalDialog & {
  Header: typeof ModalHeader;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
};

const ModalDialogExport = ModalDialog as ModalDialogType;
ModalDialogExport.Header = ModalHeader;
ModalDialogExport.Content = ModalContent;
ModalDialogExport.Footer = ModalFooter;

export {
  useAriaHidden,
  usePreventBodyScroll,
  ModalBackdrop,
  ModalDialogExport as ModalDialog,
  PointingModalContainer
};
