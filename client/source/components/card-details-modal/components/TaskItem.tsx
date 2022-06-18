import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Checkbox,
  EditablePreview,
  EditableTextarea,
  HStack,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { TaskFragmentFragment } from "../../../generated/graphql";
import { useHover } from "../../../hooks";
import { AutoResizeTextarea } from "../../AutoResizeTextarea";
import { NonEmptyEditable } from "../../non-empty-editable";

interface TaskItemProps {
  task: TaskFragmentFragment;
  onRemove: (task: TaskFragmentFragment) => void;
  onUpdate: (task: TaskFragmentFragment) => void;
}

export const TaskItem = ({ task, onUpdate, onRemove }: TaskItemProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);

  return (
    <Box ref={hoverRef} pos={"relative"} pr={8}>
      <Checkbox
        pos={"absolute"}
        top={1}
        left={0}
        defaultChecked={task.completed}
        onChange={(event) => onUpdate({ ...task, completed: event.target.checked })}
        aria-label={`${!task.completed ? "Mark" : "Unmark"} this task as completed`}
        title={`${!task.completed ? "Mark" : "Unmark"} this task as completed`}
        colorScheme={"primary"}
        borderColor={"gray.500"}
      />

      <NonEmptyEditable
        defaultValue={task.content}
        onSubmit={(content) => onUpdate({ ...task, content })}
        fontSize={"sm"}
        ml={7}
      >
        <EditablePreview
          whiteSpace={"pre-wrap"}
          maxW={"full"}
          lineHeight={"short"}
          textDecor={task.completed ? "line-through" : "none"}
        />
        <EditableTextarea
          as={AutoResizeTextarea}
          minRows={1}
          px={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              (event.target as HTMLTextAreaElement).blur();
            }
          }}
        />
      </NonEmptyEditable>

      <Box pos={"absolute"} top={0} right={0} hidden={!isHover}>
        <ButtonGroup size={"xs"} colorScheme={"gray"} variant={"ghost"}>
          <IconButton
            icon={<DeleteIcon />}
            aria-label={"Delete this task"}
            title={"Delete this task"}
            onClick={() => onRemove(task)}
          />
        </ButtonGroup>
      </Box>
    </Box>
  );
};
