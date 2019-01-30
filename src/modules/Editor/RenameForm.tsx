import React from "react";
import { TextField, Form } from "../../shared/Form";
import { Field, FormRenderProps } from "react-final-form";
import { ModalDialog } from "../../shared/Modal";
import Button from "../../shared/Button";

type Props = {
  handleSubmit: FormRenderProps["handleSubmit"];
  submitting: FormRenderProps["submitting"];
  onCancel: () => void;
};

const RenameForm = ({ handleSubmit, submitting, onCancel }: Props) => (
  <Form onSubmit={handleSubmit}>
    <ModalDialog.Header onClose={onCancel}>
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
      <Button onClick={onCancel}>Cancel</Button>
      <Button.Submit label="Rename" color="primary" disabled={submitting} />
    </ModalDialog.Footer>
  </Form>
);

export default RenameForm;
