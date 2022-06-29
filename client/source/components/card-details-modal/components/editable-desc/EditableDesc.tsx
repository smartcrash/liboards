import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableTextarea,
  Text,
  useEditableControls,
  useMergeRefs,
} from "@chakra-ui/react";
import { KeyboardEventHandler, Ref, useRef, useState } from "react";
import { AutoResizeTextarea } from "../../../";

interface EditableDescProps {
  defaultValue: string;
  onSubmit: (nextValue: string) => void;
}
const EditableControls = ({ value, submitRef }: { value: string; submitRef?: Ref<any> }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();
  const { ref, ...submitButtonProps } = getSubmitButtonProps();

  const submitRefs = useMergeRefs(submitRef, ref);

  if (isEditing) {
    return (
      <ButtonGroup size={"sm"} mt={2}>
        <Button {...submitButtonProps} ref={submitRefs} data-testid={"save"}>
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
  const submitRef = useRef<HTMLButtonElement>();
  const [value, setValue] = useState(defaultValue);

  // Trigger submit when Ctrl + Enter is pressed
  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      submitRef.current?.click();
    }
  };

  return (
    <Editable onChange={setValue} defaultValue={defaultValue} onSubmit={onSubmit} color={"gray.600"}>
      {value && <EditablePreview data-testid={"preview"} whiteSpace={"pre-wrap"} w={"full"} lineHeight={"short"} />}
      <EditableTextarea as={AutoResizeTextarea} minRows={5} px={0} data-testid={"textarea"} onKeyDown={onKeyDown} />
      <EditableControls value={value} submitRef={submitRef} />
    </Editable>
  );
};
