import {
  ChakraInputProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { useController, UseControllerProps } from "react-hook-form";

interface InputProps<T>
  extends UseControllerProps<T>,
    Omit<ChakraInputProps, keyof UseControllerProps<T>> {
  label?: string;
}

export function Input<T>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  ...props
}: InputProps<T>) {
  const {
    field: { value, ...field },
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
  });

  return (
    <FormControl isInvalid={!!error?.message}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraInput
        value={value ? `${value}` : ""}
        id={name}
        isRequired={!!rules?.required}
        {...props}
        {...field}
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
