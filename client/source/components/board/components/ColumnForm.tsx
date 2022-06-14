import { AdderForm } from "./AdderForm";

interface ColumnFormProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const ColumnForm = ({ onConfirm, onCancel }: ColumnFormProps) => {
  return (
    <AdderForm
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={"Add column"}
      inputProps={{ placeholder: "Enter column title..." }}
    />
  );
};
