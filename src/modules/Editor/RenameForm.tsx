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

const RenameForm: React.FunctionComponent<Props> = ({
  handleSubmit,
  submitting,
  onCancel
}) => (
  <Form onSubmit={handleSubmit}>
    <Field name="name" label="Collection name:" component={TextField as any} />
    <ModalDialog.Footer>
      <Button onClick={onCancel}>Cancel</Button>
      <Button.Submit label="Rename" color="primary" disabled={submitting} />
    </ModalDialog.Footer>
  </Form>
);

export default RenameForm;
