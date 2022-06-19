import { Stack, ButtonGroup, Button } from "@chakra-ui/react";
import { useRef, FormEventHandler, KeyboardEventHandler } from "react";
import { AutoResizeTextarea } from "../../AutoResizeTextarea";

interface CommentEditFormProps {
  defaultValue: string;
  onConfirm: (content: string) => void;
  onCancel: () => void;
}

export const CommentEditForm = ({ defaultValue, onConfirm, onCancel }: CommentEditFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const value = textAreaRef.current?.value;

    if (value?.trim()) onConfirm(value);
    else textAreaRef.current?.focus();
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      (event.target as HTMLTextAreaElement).blur();
    }
  };

  return (
    <Stack as={"form"} onSubmit={handleSubmit} flexGrow={1} w={"full"}>
      <AutoResizeTextarea
        ref={textAreaRef}
        size={"sm"}
        defaultValue={defaultValue}
        placeholder={"Comment..."}
        required
        autoFocus
        onFocus={(event) => event.target.select()}
        onKeyDown={onKeyDown}
      />

      <ButtonGroup size={"sm"} spacing={1} justifyContent={"flex-end"}>
        <Button colorScheme={"gray"} onClick={onCancel}>
          Cancel
        </Button>
        <Button type={"submit"}>Update</Button>
      </ButtonGroup>
    </Stack>
  );
};
