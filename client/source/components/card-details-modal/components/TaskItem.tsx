import { DeleteIcon } from "@chakra-ui/icons";
import { Box, ButtonGroup, IconButton, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { TaskFragmentFragment } from "../../../generated/graphql";
import { useHover } from "../../../hooks";

interface TaskItemProps {
  task: TaskFragmentFragment;
  onRemove: (taks: TaskFragmentFragment) => void;
}

export const TaskItem = ({ task, onRemove }: TaskItemProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);

  return (
    <Box ref={hoverRef} pos={"relative"}>
      <Text fontSize={"sm"}>{task.content}</Text>

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
