import {
  Box,
  Button,
  Divider,
  EditablePreview,
  EditableTextarea,
  Heading,
  HStack,
  ModalBody,
  Progress,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { orderBy } from "lodash";
import {
  FindCardByIdQuery,
  useAddCommentMutation,
  useAddTaskMutation,
  useRemoveCommentMutation,
  useRemoveTaskMutation,
  useUpdateCardMutation,
  useUpdateCommentMutation,
  useUpdateTaskMutation,
} from "../../generated/graphql";
import { useToggle } from "../../hooks";
import { AutoResizeTextarea } from "../AutoResizeTextarea";
import { NonEmptyEditable } from "../non-empty-editable";
import { CommentAdder } from "./components/CommentAdder";
import { CommentItem } from "./components/CommentItem";
import { EditableDesc } from "./components/editable-desc";
import { TaskAdder } from "./components/TaskAdder";
import { TaskItem } from "./components/TaskItem";
import { TaskList } from "./components/TaskList";

interface CardModalContentProps {
  card: Exclude<FindCardByIdQuery["card"], null | undefined>;
}

export const CardDetailsModalContent = ({ card }: CardModalContentProps) => {
  const [, updateCard] = useUpdateCardMutation();
  const [, addTask] = useAddTaskMutation();
  const [, updateTask] = useUpdateTaskMutation();
  const [, removeTask] = useRemoveTaskMutation();
  const [, addComment] = useAddCommentMutation();
  const [, updateComment] = useUpdateCommentMutation();
  const [, removeComment] = useRemoveCommentMutation();

  const { id, title, description, column, tasks, comments } = card;
  const progress = (tasks.filter((task) => task.completed).length / tasks.length) * 100;

  const [showCompleted, toggleShowCompleted] = useToggle(true);

  return (
    <ModalBody pl={10} pr={20} pt={5} pb={10} minH={96}>
      <Box>
        <NonEmptyEditable
          defaultValue={title}
          onSubmit={(title) => updateCard({ id, title })}
          fontSize={"3xl"}
          fontWeight={"bold"}
        >
          <EditablePreview lineHeight={"short"} maxW={"full"} />
          <EditableTextarea
            as={AutoResizeTextarea}
            px={0}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                (event.target as HTMLTextAreaElement).blur();
              }
            }}
          />
        </NonEmptyEditable>

        <Text color={"gray.500"}>
          In column{" "}
          <Text as={"span"} textDecor={"underline"} fontWeight={"semibold"}>
            {column.title}
          </Text>
        </Text>
      </Box>

      <Spacer h={10} />

      <Stack spacing={3}>
        <Heading as={"h5"} size={"sm"}>
          Description
        </Heading>

        <EditableDesc defaultValue={description} onSubmit={(description) => updateCard({ id, description })} />
      </Stack>

      <Divider my={3} />

      {!!tasks.length && (
        <>
          <Stack spacing={4}>
            <HStack justifyContent={"space-between"}>
              <Heading as="h6" size="xs">
                Sub-tasks
              </Heading>

              <Button colorScheme={"gray"} variant={"solid"} size={"xs"} onClick={toggleShowCompleted}>
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

      <Divider my={3} />

      {!!comments.length && (
        <>
          <HStack alignItems={"center"}>
            <Heading as="h6" size="xs">
              Comments
            </Heading>
            <Text fontSize={"xs"} color={"gray.500"}>
              {comments.length}
            </Text>
          </HStack>

          <Spacer h={5} />

          <Stack spacing={5}>
            {orderBy(comments, ({ createdAt }) => new Date(createdAt), "desc").map((comment) => (
              <CommentItem
                comment={comment}
                onEdit={(content) => updateComment({ ...comment, content })}
                onRemove={() => removeComment(comment)}
                key={comment.id}
              />
            ))}
          </Stack>

          <Spacer h={5} />
        </>
      )}

      <CommentAdder onConfirm={(content) => addComment({ content, cardId: id })} />
    </ModalBody>
  );
};
