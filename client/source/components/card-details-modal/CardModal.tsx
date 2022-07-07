import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { FindCardByIdQuery, useFindCardByIdQuery } from "../../generated/graphql";
import { CardModalContent } from "./CardModalContent";

export type CardType = Exclude<FindCardByIdQuery["card"], null | undefined>;

export interface CardModalProps {
  id?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CardModal = ({ id = -1, isOpen = false, onClose = () => {} }: CardModalProps) => {
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
          {!!card && <CardModalContent card={card} />}
        </ModalContent>
      </Modal>
    </>
  );
};
