import {
  ChakraInputProps,
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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface PasswordInputProps<T>
  extends UseControllerProps<T>,
    Omit<ChakraInputProps, keyof UseControllerProps<T>> {
  label?: string;
}

export function PasswordInput<T>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  label,
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
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
            size={"lg"}
            onClick={onClick}
          />
        </InputRightElement>
        <ChakraInput
          value={value ? `${value}` : ""}
          id={name}
          type={isOpen ? "text" : "password"}
          ref={mergeRef}
          {...props}
          {...field}
        />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
