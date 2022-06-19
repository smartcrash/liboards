import { BoxProps, Button, ButtonGroup, ChakraInputProps, Input, Stack } from "@chakra-ui/react";
import { FormEventHandler, KeyboardEventHandler, useRef } from "react";

interface AdderFormProps extends BoxProps {
  onConfirm: (inputValue: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  inputProps?: ChakraInputProps;
}

export const AdderForm = ({
  onConfirm,
  onCancel,
  confirmText = "Add",
  cancelText = "Cancel",
  inputProps,
  ...props
}: AdderFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    const value = inputRef.current?.value;

    if (value) onConfirm(value);
    else inputRef.current?.focus();
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Escape") onCancel();
  };

  return (
    <Stack as={"form"} onSubmit={onSubmit} {...props}>
      <Input type={"text"} ref={inputRef} autoFocus={true} onKeyDown={onKeyDown} {...inputProps} />

      <ButtonGroup size={"sm"} spacing={1}>
        <Button type={"submit"}>{confirmText}</Button>
        <Button colorScheme={"gray"} onClick={onCancel}>
          {cancelText}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
