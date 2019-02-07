import { isEmpty } from "lodash";
import React from "react";
import { Field, Form } from "react-final-form";
import Button from "../../../shared/Button";
import { Form as FormElement, TextField } from "../../../shared/Form";
import { ModalDialog } from "../../../shared/Modal";

const FORM_SUBSCRIPTION = { submitting: true };

type Props = {
  isOpen: boolean;
  name: string;
  onRename: (values: any) => void;
  onClose: () => void;
};

const RenameEntityModal = ({ isOpen, name, onRename, onClose }: Props) => {
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
          <FormElement onSubmit={handleSubmit}>
            <ModalDialog.Header onClose={onClose}>
              Rename a collection
            </ModalDialog.Header>
            <ModalDialog.Content>
              <Field
                name="name"
                label="Collection name:"
                component={TextField as any}
              />
            </ModalDialog.Content>
            <ModalDialog.Footer>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" color="primary" disabled={submitting}>
                Rename
              </Button>
            </ModalDialog.Footer>
          </FormElement>
        )}
      />
    </ModalDialog>
  );
};

export default React.memo(
  RenameEntityModal,
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
