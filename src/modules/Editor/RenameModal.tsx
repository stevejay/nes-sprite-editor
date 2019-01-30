import { isEmpty } from "lodash";
import React from "react";
import { Form } from "react-final-form";
import { ModalDialog } from "../../shared/Modal";
import RenameForm from "./RenameForm";

const FORM_SUBSCRIPTION = { submitting: true };

type Props = {
  isOpen: boolean;
  name: string;
  onRename: (values: any) => void;
  onClose: () => void;
};

const RenameModal = ({ isOpen, name, onRename, onClose }: Props) => {
  const handleSubmit = React.useCallback(
    (values: any) => {
      const value = values.name.trim();
      if (isEmpty(value)) {
        return;
      }
      onRename(value);
      onClose();
    },
    [onRename, onClose]
  );

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose}>
      <Form
        onSubmit={handleSubmit}
        initialValues={{ name }}
        subscription={FORM_SUBSCRIPTION}
        render={({ handleSubmit, submitting }) => (
          <RenameForm
            handleSubmit={handleSubmit}
            onCancel={onClose}
            submitting={submitting}
          />
        )}
      />
    </ModalDialog>
  );
};

export default React.memo(
  RenameModal,
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
