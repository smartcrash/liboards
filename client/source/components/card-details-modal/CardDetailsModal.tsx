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
import { useAddTaskMutation, useFindCardByIdQuery, useUpdateCardMutation } from "../../generated/graphql";
import { EditableDesc, TaskAdder } from "./components";

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

  if (!id) return null;
  if (fetching) return null; // TODO: Show spinner
  if (!data || !data.card) return null; // TODO: not found error

  const { title, description, column, tasks } = data.card;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody pr={20} pt={3} minH={96}>
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

          <Spacer h={10} />

          <Box>
            <Stack>
              {tasks.map((task) => (
                <Box key={task.id}>{task.description}</Box>
              ))}
            </Stack>

            <TaskAdder onConfirm={(content) => addTask({ cardId: id, description: content })} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
