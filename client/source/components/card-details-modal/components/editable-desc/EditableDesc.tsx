import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableTextarea,
  Text,
  useEditableControls,
} from "@chakra-ui/react";
import { useState } from "react";
import { AutoResizeTextarea } from "../../../";

interface EditableDescProps {
  defaultValue: string;
  onSubmit: (nextValue: string) => void;
}
const EditableControls = ({ value }: { value: string }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  if (isEditing) {
    return (
      <ButtonGroup size={"sm"} mt={2}>
        <Button {...getSubmitButtonProps()} data-testid={"save"}>
          Save
        </Button>
        <Button colorScheme={"gray"} {...getCancelButtonProps()} data-testid={"cancel"}>
          Cancel
        </Button>
      </ButtonGroup>
    );
  }

  if (!value) {
    return (
      <Box role={"button"} px={2} py={2} {...getEditButtonProps()} data-testid={"placeholder"}>
        <Text color={"gray.500"}>Add a more detailed description...</Text>
      </Box>
    );
  }

  return null;
};

export const EditableDesc = ({ defaultValue, onSubmit }: EditableDescProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Editable onChange={setValue} defaultValue={defaultValue} onSubmit={onSubmit} color={"gray.600"}>
      {value && <EditablePreview data-testid={"preview"} whiteSpace={"pre-wrap"} w={"full"} lineHeight={"short"} />}
      <EditableTextarea as={AutoResizeTextarea} minRows={5} px={0} data-testid={"textarea"} />
      <EditableControls value={value} />
    </Editable>
  );
};
