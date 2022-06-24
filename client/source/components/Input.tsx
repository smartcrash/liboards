import {
  FormControl,
  FormControlOptions,
  FormErrorMessage,
  FormLabel,
  HTMLChakraProps,
  Input as ChakraInput,
  ThemingProps,
} from "@chakra-ui/react";
import { useController, UseControllerProps } from "react-hook-form";

// Recreate Chakra's InputProps because is not exposed
// on production bumdle and make the deployment crash
interface InputOptions {
  focusBorderColor?: string;
  errorBorderColor?: string;
  htmlSize?: number;
}
declare type Omitted = "disabled" | "required" | "readOnly" | "size";

export interface ChakraInputProps
  extends Omit<HTMLChakraProps<"input">, Omitted>,
    InputOptions,
    ThemingProps<"Input">,
    FormControlOptions {}

export interface InputProps<T> extends UseControllerProps<T>, Omit<ChakraInputProps, keyof UseControllerProps<T>> {
  label?: string;
}

export function Input<T>({ control, name, rules, defaultValue, shouldUnregister, label, ...props }: InputProps<T>) {
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
      <ChakraInput value={value ? `${value}` : ""} id={name} isRequired={!!rules?.required} {...props} {...field} />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
