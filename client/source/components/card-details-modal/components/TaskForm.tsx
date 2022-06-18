import { AdderForm } from "../../";

interface TaskFormProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const TaskForm = ({ onConfirm, onCancel }: TaskFormProps) => {
  return (
    <AdderForm
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={"Add task"}
      data-testid={"task-form"}
      inputProps={{ placeholder: "Add a task" }}
    />
  );
};
