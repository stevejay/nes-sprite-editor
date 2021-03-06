import * as React from "react";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import FocusTrap from "focus-trap-react";
import {
  PointingModalContainer,
  usePreventBodyScroll,
  useAriaHidden,
  ModalBackdrop
} from "..";
import { Portal } from "react-portal";

const Button = ({ label }: { label: string }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <button ref={buttonRef} onClick={() => setIsOpen(true)}>
        {label}
      </button>
      <Modal
        isOpen={isOpen}
        originElement={buttonRef.current}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

const Modal = ({
  isOpen,
  originElement,
  onClose
}: {
  isOpen: boolean;
  originElement: HTMLElement | null;
  onClose: () => void;
}) => {
  usePreventBodyScroll(isOpen);
  useAriaHidden(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <>
        <ModalBackdrop opacity={0} onClose={onClose} />
        <FocusTrap focusTrapOptions={{ onDeactivate: onClose }}>
          <PointingModalContainer originElement={originElement}>
            <div
              style={{ width: 200, height: 50, backgroundColor: "papayawhip" }}
            >
              Pointing to some content
              <br />
              <button onClick={onClose}>Close</button>
            </div>
          </PointingModalContainer>
        </FocusTrap>
      </>
    </Portal>
  );
};

storiesOf("Modal/PointingModalContainer", module).add("Basic", () => (
  <div
    style={{
      width: "100vw",
      height: "120vh"
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        justifyContent: "space-between"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <Button label="Top left" />
        <Button label="Middle left" />
        <Button label="Bottom left" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Button label="Top middle" />
        <Button label="Middle middle" />
        <Button label="Bottom middle" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}
      >
        <Button label="Top right" />
        <Button label="Middle right" />
        <Button label="Bottom right" />
      </div>
    </div>
  </div>
));
