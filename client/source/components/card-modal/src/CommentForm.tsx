import { Button, ButtonGroup, Stack } from "@chakra-ui/react";
import { FormEventHandler, KeyboardEventHandler, useRef } from "react";
import { AutoResizeTextarea } from "../..";

interface CommentFormProps {
  onConfirm: (content: string) => void;
}

export const CommentForm = ({ onConfirm }: CommentFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const value = textAreaRef.current?.value;

    if (value) {
      onConfirm(value);
      (event.target as HTMLFormElement).reset();
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      (event.target as HTMLTextAreaElement).blur();
    } else if (event.key === "Enter" && event.ctrlKey) {
      submitRef.current?.click();
    }
  };

  return (
    <Stack as={"form"} onSubmit={handleSubmit} flexGrow={1}>
      <AutoResizeTextarea
        ref={textAreaRef}
        size={"sm"}
        placeholder={"Write a comment..."}
        required
        onKeyDown={onKeyDown}
      />

      <ButtonGroup>
        <Button type={"submit"} ref={submitRef} size={"sm"}>
          Comment
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
