import { Avatar, Button, ButtonGroup, HStack, Stack } from "@chakra-ui/react";
import { FormEventHandler, KeyboardEventHandler, useRef, useState } from "react";
import { AutoResizeTextarea } from "../../";

interface CommentFromProps {
  onConfirm: (content: string) => Promise<any | void> | void;
}

export const CommentFrom = ({ onConfirm }: CommentFromProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const value = textAreaRef.current?.value;

    if (value) {
      await onConfirm(value);
      (event.target as HTMLFormElement).reset();
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      (event.target as HTMLTextAreaElement).blur();
    }
  };

  return (
    <HStack alignItems={"flex-start"} spacing={3}>
      <Avatar size={"sm"} />
      <Stack as={"form"} onSubmit={handleSubmit} flexGrow={1}>
        <AutoResizeTextarea
          ref={textAreaRef}
          size={"sm"}
          placeholder={"Write a comment..."}
          required
          onKeyDown={onKeyDown}
        />
        <ButtonGroup size={"sm"}>
          <Button type={"submit"}>Comment</Button>
        </ButtonGroup>
      </Stack>
    </HStack>
  );
};
