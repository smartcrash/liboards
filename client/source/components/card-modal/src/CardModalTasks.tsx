import { Button, Heading, HStack, Progress, Spacer, Stack, Text } from "@chakra-ui/react";
import { useToggle } from "../../../hooks";
import { useCardModalContext } from "./CardModal";
import { TaskAdder } from "./TaskAdder";
import { TaskItem } from "./TaskItem";
import { TaskList } from "./TaskList";

export const CardModalTasks = () => {
  const [showCompleted, toggleShowCompleted] = useToggle(true);
  const { card, addTask, updateTask, removeTask } = useCardModalContext();
  const { id, tasks } = card;

  const progress = (tasks.filter((task) => task.completed).length / tasks.length) * 100;

  return (
    <>
      {!!tasks.length && (
        <>
          <Stack spacing={4}>
            <HStack justifyContent={"space-between"}>
              <Heading as="h6" size="xs">
                Sub-tasks
              </Heading>

              <Button
                colorScheme={"gray"}
                variant={"solid"}
                size={"xs"}
                onClick={toggleShowCompleted}
                data-testid={"toggle-show-completed"}
              >
                {showCompleted ? "Hide" : "Show"} completed
              </Button>
            </HStack>

            <HStack spacing={3}>
              <Text color={"gray.500"} fontSize={"sm"}>
                {progress.toFixed(0)}%
              </Text>
              <Progress
                value={progress}
                hasStripe
                size={"sm"}
                colorScheme={"primary"}
                borderRadius={"full"}
                flexGrow={1}
              />
            </HStack>

            <TaskList>
              {tasks
                .filter((task) => (!showCompleted ? !task.completed : true))
                .map((task) => (
                  <TaskItem
                    task={task}
                    onUpdate={({ id, content, completed }) => updateTask({ id, content, completed })}
                    onRemove={() => removeTask({ id: task.id })}
                    key={task.id}
                  />
                ))}
            </TaskList>
          </Stack>

          <Spacer h={5} />
        </>
      )}

      <TaskAdder onConfirm={(content) => addTask({ cardId: id, content })} />
    </>
  );
};
