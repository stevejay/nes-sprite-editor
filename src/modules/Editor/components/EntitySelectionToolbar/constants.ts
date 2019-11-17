export enum CollectionOperationTypes {
  NEW = "NEW",
  COPY = "COPY",
  DELETE = "DELETE",
  RENAME = "RENAME"
}

export const COLLECTION_OPTIONS = [
  { id: CollectionOperationTypes.NEW, label: "New" },
  { id: CollectionOperationTypes.COPY, label: "Copy" },
  { id: CollectionOperationTypes.DELETE, label: "Delete" },
  { id: CollectionOperationTypes.RENAME, label: "Rename\u2026" }
];
