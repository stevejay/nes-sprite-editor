import React from "react";
import { ModalDialog } from "../../shared/Modal";
import { Form } from "react-final-form";
import Button from "../../shared/Button";
import { TextField } from "../../shared/Form";
import RenameForm from "./RenameForm";
import { isEmpty } from "lodash";

const FORM_SUBSCRIPTION = { submitting: true };

type Props = {
  isOpen: boolean;
  name: string;
  onRename: (values: any) => void;
  onClose: () => void;
};

const RenameModal: React.FunctionComponent<Props> = ({
  isOpen,
  name,
  onRename,
  onClose
}) => {
  const initialValues = React.useMemo(() => ({ name }), [name]);

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
      <ModalDialog.Header onClose={onClose}>
        Rename a collection
      </ModalDialog.Header>
      <ModalDialog.Content>
        <Form
          onSubmit={handleSubmit}
          initialValues={initialValues}
          subscription={FORM_SUBSCRIPTION}
          render={({ handleSubmit, submitting }) => (
            <RenameForm
              handleSubmit={handleSubmit}
              onCancel={onClose}
              submitting={submitting}
            />
          )}
        />
      </ModalDialog.Content>
    </ModalDialog>
  );
};

export default React.memo(RenameModal);
