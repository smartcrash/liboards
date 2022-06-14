import { Stack, Input, ButtonGroup, Button } from "@chakra-ui/react";
import { FormEventHandler, useRef } from "react";

interface ColumnFormProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const ColumnForm = ({ onConfirm, onCancel }: ColumnFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addColumn: FormEventHandler = (event) => {
    event.preventDefault();

    const value = inputRef.current?.value;

    if (value) onConfirm(value);
  };

  return (
    <Stack as={"form"} onSubmit={addColumn}>
      <Input type={"text"} ref={inputRef} autoFocus={true} />
      <ButtonGroup size={"sm"} spacing={1}>
        <Button type={"submit"}>Add column</Button>
        <Button colorScheme={"gray"} onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
