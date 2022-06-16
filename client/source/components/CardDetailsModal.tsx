import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useFindCardByIdQuery } from "../generated/graphql";

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

  if (!id) return null;
  if (fetching) return null; // TODO: Show spinner
  if (!data || !data.card) return null; // TODO: not found error

  const { title, description, column } = data.card;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
