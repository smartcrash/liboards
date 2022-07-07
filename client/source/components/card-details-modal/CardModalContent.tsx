import { Divider, ModalBody } from "@chakra-ui/react";
import { CardType } from "./CardModal";
import { CardModalCommnents } from "./CardModalCommnents";
import { CardModalHeader } from "./CardModalHeader";
import { CardModalTasks } from "./CardModalTasks";

export const CardModalContent = () => {
  return (
    <ModalBody pl={10} pr={20} pt={5} pb={10} minH={96}>
      <CardModalHeader />

      <Divider my={3} />

      <CardModalTasks />

      <Divider my={3} />

      <CardModalCommnents />
    </ModalBody>
  );
};
