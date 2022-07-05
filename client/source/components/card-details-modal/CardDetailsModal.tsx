import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useFindCardByIdQuery } from "../../generated/graphql";
import { CardDetailsModalContent } from "./CardDetailsModalContent";

interface CardDetailsModalProps {
  id?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailsModal = ({ id = -1, isOpen, onClose }: CardDetailsModalProps) => {
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
          {!!card && <CardDetailsModalContent card={card} />}
        </ModalContent>
      </Modal>
    </>
  );
};
