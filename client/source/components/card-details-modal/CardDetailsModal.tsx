import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Divider,
  EditablePreview,
  EditableTextarea,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Progress,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AutoResizeTextarea, NonEmptyEditable } from "../";
import {
  useAddCommentMutation,
  useAddTaskMutation,
  useFindCardByIdQuery,
  useRemoveCommentMutation,
  useRemoveTaskMutation,
  useUpdateCardMutation,
  useUpdateCommentMutation,
  useUpdateTaskMutation,
} from "../../generated/graphql";
import { useToggle } from "../../hooks";
import { CommentItem, EditableDesc, TaskAdder, TaskItem, TaskList } from "./components";
import { CommentAdder } from "./components/CommentAdder";

interface CardDetailsModalProps {
  id?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailsModal = ({ id, isOpen, onClose }: CardDetailsModalProps) => {
  const [{ data, fetching }] = useFindCardByIdQuery({
    variables: { id: id! },
    pause: !id,
  });
  const [, updateCard] = useUpdateCardMutation();

  const [, addTask] = useAddTaskMutation();
  const [, updateTask] = useUpdateTaskMutation();
  const [, removeTask] = useRemoveTaskMutation();

  const [, addComment] = useAddCommentMutation();
  const [, updateComment] = useUpdateCommentMutation();
  const [, removeComment] = useRemoveCommentMutation();

  const [showCompleted, toggleShowCompleted] = useToggle(true);

  if (!id) return null;
  if (fetching) return null; // TODO: Show spinner
  if (!data || !data.card) return null; // TODO: not found error

  const { title, description, column, tasks, comments } = data.card;
  const progress = (tasks.filter((task) => task.completed).length / tasks.length) * 100;

  return (
    <>
      {isOpen && <Helmet title={data.card.title} />}

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
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
                  {comments.map((comment) => (
                    <CommentItem
                      comment={comment}
                      onEdit={(content) => updateComment({ ...comment, content })}
                      onRemove={() => removeComment(comment)}
                      key={comment.id}
                    />
                  ))}
                </Stack>

                <Spacer h={3} />
              </>
            )}

            <CommentAdder onConfirm={(content) => addComment({ content, cardId: id })} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
