import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { ColumnForm } from "./ColumnForm";

interface ColumnAdderProps {
  onConfirm: (title: string) => void;
}

export const ColumnAdder = ({ onConfirm }: ColumnAdderProps) => {
  const [isAddingColumn, setAddingColumn] = useState(false);

  const confirmColumn = (title: string) => onConfirm(title);

  return isAddingColumn ? (
    <ColumnForm onConfirm={confirmColumn} onCancel={() => setAddingColumn(false)} />
  ) : (
    <Button
      colorScheme={"gray"}
      variant={"outline"}
      onClick={() => setAddingColumn(true)}
      leftIcon={<AddIcon />}
      w={"full"}
      fontSize={"sm"}
      data-testid={"add-column"}
    >
      Add another column
    </Button>
  );
};
