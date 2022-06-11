import {} from "@chakra-ui/hooks";
import {
  Editable,
  EditableInput,
  EditablePreview,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface FieldValues {
  title?: string;
  description?: string;
}

interface EditableTitleAndDescProps {
  defaultValues: FieldValues;
  onSubmit: (nextValues: FieldValues) => void;
}

export const EditableTitleAndDesc = ({
  defaultValues,
  onSubmit,
}: EditableTitleAndDescProps) => {
  const [title, setTitle] = useState(defaultValues.title);
  const prevTitleRef = useRef(title);
  const [desc, setDesc] = useState(defaultValues.description);
  const prevDescRef = useRef(desc);

  const handleSubmit = (values: FieldValues) => onSubmit(values);

  return (
    <VStack alignItems={"flex-start"}>
      <Editable
        value={title}
        onChange={setTitle}
        onSubmit={(nextValue) => {
          if (!nextValue) setTitle(prevTitleRef.current);
          prevTitleRef.current = nextValue;
          handleSubmit({ title: nextValue });
        }}
        onCancel={() => setTitle(prevTitleRef.current)}
        fontSize={"3xl"}
        fontWeight={"bold"}
      >
        <EditablePreview cursor={"pointer"} />
        <EditableInput data-testid={"title"} />
      </Editable>

      <Editable
        value={desc}
        onChange={setDesc}
        onSubmit={(nextValue) => {
          if (!nextValue) setDesc(prevDescRef.current);
          prevDescRef.current = nextValue;
          handleSubmit({ description: nextValue });
        }}
        onCancel={() => setDesc(prevDescRef.current)}
      >
        <EditablePreview cursor={"pointer"} />
        <EditableInput data-testid={"description"} />
      </Editable>
    </VStack>
  );
};
