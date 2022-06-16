import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { useRef, useState } from "react";

interface EditableTitleProps {
  defaultValue: string;
  onSubmit: (nextValue: string) => void;
}

export const EditableTitle = ({ defaultValue, onSubmit }: EditableTitleProps) => {
  const [title, setTitle] = useState(defaultValue);
  const prevTitleRef = useRef(title);

  return (
    <Editable
      value={title}
      onChange={setTitle}
      onSubmit={(nextValue) => {
        if (!nextValue) setTitle(prevTitleRef.current);
        prevTitleRef.current = nextValue;
        onSubmit(nextValue);
      }}
      onCancel={() => setTitle(prevTitleRef.current)}
      fontSize={"3xl"}
      fontWeight={"bold"}
    >
      <EditablePreview cursor={"pointer"} />
      <EditableInput data-testid={"title"} />
    </Editable>
  );
};
