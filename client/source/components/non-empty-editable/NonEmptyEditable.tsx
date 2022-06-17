import { Editable, EditableProps } from "@chakra-ui/react";
import { useRef, useState } from "react";

interface NonEmptyEditableProps extends EditableProps {
  defaultValue: string;
}

export const NonEmptyEditable = ({ defaultValue, onSubmit = () => {}, children, ...props }: NonEmptyEditableProps) => {
  const [value, setValue] = useState(defaultValue);
  const prevValueRef = useRef(value);

  return (
    <Editable
      value={value}
      onChange={setValue}
      onSubmit={(nextValue) => {
        if (nextValue) {
          prevValueRef.current = nextValue;
          onSubmit(nextValue);
        } else setValue(prevValueRef.current);
      }}
      onCancel={() => setValue(prevValueRef.current)}
      {...props}
    >
      {children}
    </Editable>
  );
};
