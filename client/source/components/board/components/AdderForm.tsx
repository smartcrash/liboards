import { Stack, Input, ButtonGroup, Button, InputElementProps, useEventListener, BoxProps } from "@chakra-ui/react";
import { useRef, FormEventHandler } from "react";

interface AdderFormProps extends BoxProps {
  onConfirm: (inputValue: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  inputProps?: InputElementProps;
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

  useEventListener("keydown", (event) => {
    if (event.key === "Escape") onCancel();
  });

  const addColumn: FormEventHandler = (event) => {
    event.preventDefault();

    const value = inputRef.current?.value;

    if (value) onConfirm(value);
    else inputRef.current?.focus();
  };

  return (
    <Stack as={"form"} onSubmit={addColumn} {...props}>
      <Input type={"text"} ref={inputRef} autoFocus={true} {...inputProps} />
      <ButtonGroup size={"sm"} spacing={1}>
        <Button type={"submit"}>{confirmText}</Button>
        <Button colorScheme={"gray"} onClick={onCancel}>
          {cancelText}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
