import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { TaskForm } from "./TaskForm";

interface TaskAdderProps {
  onConfirm: (title: string) => void;
}

export const TaskAdder = ({ onConfirm }: TaskAdderProps) => {
  const [isAddingTask, setAddingTask] = useState(false);

  function confirmColumn(content: string) {
    onConfirm(content);
    setAddingTask(false);
  }

  return isAddingTask ? (
    <TaskForm onConfirm={confirmColumn} onCancel={() => setAddingTask(false)} />
  ) : (
    <Button
      onClick={() => setAddingTask(true)}
      leftIcon={<AddIcon fontSize={"x-small"} />}
      size={"sm"}
      variant={"link"}
      data-testid={"add-task"}
    >
      Add sub-task
    </Button>
  );
};
