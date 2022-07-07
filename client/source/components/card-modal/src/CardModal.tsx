import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { createContext } from "@chakra-ui/react-utils";
import { Helmet } from "react-helmet";
import {
  FindCardByIdQuery,
  useAddCommentMutation,
  useAddTaskMutation,
  useFindCardByIdQuery,
  useRemoveCommentMutation,
  useRemoveTaskMutation,
  useUpdateCardMutation,
  useUpdateCommentMutation,
  useUpdateTaskMutation,
} from "../../../generated/graphql";
import { CardModalContent } from "./CardModalContent";

export type CardType = Exclude<FindCardByIdQuery["card"], null | undefined>;

interface CardModalContext {
  card: CardType;
  updateCard: ReturnType<typeof useUpdateCardMutation>[1];
  addTask: ReturnType<typeof useAddTaskMutation>[1];
  updateTask: ReturnType<typeof useUpdateTaskMutation>[1];
  removeTask: ReturnType<typeof useRemoveTaskMutation>[1];
  addComment: ReturnType<typeof useAddCommentMutation>[1];
  updateComment: ReturnType<typeof useUpdateCommentMutation>[1];
  removeComment: ReturnType<typeof useRemoveCommentMutation>[1];
}

const [CardModalContextProvider, useCardModalContext] = createContext<CardModalContext>();

export { CardModalContextProvider, useCardModalContext };

export interface CardModalProps {
  id?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CardModal = ({ id = -1, isOpen = false, onClose = () => {} }: CardModalProps) => {
  const [, addTask] = useAddTaskMutation();

  const [, updateTask] = useUpdateTaskMutation();
  const [, removeTask] = useRemoveTaskMutation();
  const [, updateCard] = useUpdateCardMutation();

  const [, addComment] = useAddCommentMutation();
  const [, updateComment] = useUpdateCommentMutation();
  const [, removeComment] = useRemoveCommentMutation();

  const [{ data, fetching }] = useFindCardByIdQuery({
    variables: { id },
    pause: id < 1,
  });

  const card = data?.card;

  return (
    <>
      {isOpen && !!card && <Helmet title={card.title} />}

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {fetching && <>Loading...</>}
          {!!card && (
            <CardModalContextProvider
              value={{
                card,
                updateCard,
                addTask,
                updateTask,
                removeTask,
                addComment,
                updateComment,
                removeComment,
              }}
            >
              <CardModalContent />
            </CardModalContextProvider>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
