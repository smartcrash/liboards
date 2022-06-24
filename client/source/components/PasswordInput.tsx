import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useController } from "react-hook-form";
import { InputProps } from "./Input";

interface PasswordInputProps<T> extends InputProps<T> {}

export function PasswordInput<T>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  size,
  ...props
}: PasswordInputProps<T>) {
  const {
    field: { value, ref, ...field },
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
  });
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const onClick = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <FormControl isInvalid={!!error?.message}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup size={size}>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
            onClick={onClick}
            size={size}
            tabIndex={-1}
          />
        </InputRightElement>
        <ChakraInput
          value={value ? `${value}` : ""}
          id={name}
          type={isOpen ? "text" : "password"}
          ref={mergeRef}
          isRequired={!!rules?.required}
          {...props}
          {...field}
        />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
