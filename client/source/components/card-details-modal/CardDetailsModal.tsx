import {
  Box,
  EditablePreview,
  EditableTextarea,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AutoResizeTextarea, NonEmptyEditable } from "../";
import {
  useAddTaskMutation,
  useFindCardByIdQuery,
  useRemoveTaskMutation,
  useUpdateCardMutation,
} from "../../generated/graphql";
import { EditableDesc, TaskAdder, TaskItem, TaskList } from "./components";

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
  const [, removeTask] = useRemoveTaskMutation();

  if (!id) return null;
  if (fetching) return null; // TODO: Show spinner
  if (!data || !data.card) return null; // TODO: not found error

  const { title, description, column, tasks } = data.card;

  return (
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

          {!!tasks.length && (
            <>
              <Spacer h={7} />
              <Heading as="h6" size="xs" mb={6}>
                Sub-tasks
              </Heading>
            </>
          )}

          <Stack spacing={5}>
            <TaskList>
              {tasks.map((task) => (
                <TaskItem task={task} onRemove={() => removeTask({ id: task.id })} key={task.id} />
              ))}
            </TaskList>

            <Box>
              <TaskAdder onConfirm={(content) => addTask({ cardId: id, content })} />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
