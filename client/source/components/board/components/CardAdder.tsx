import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { CardForm } from "./CardForm";

interface CardAdderProps {
  onConfirm: (title: string) => void;
}

export const CardAdder = ({ onConfirm }: CardAdderProps) => {
  const [isAddingCard, setAddingCard] = useState(false);

  function confirmColumn(title: string) {
    onConfirm(title);
    setAddingCard(false);
  }

  return isAddingCard ? (
    <CardForm onConfirm={confirmColumn} onCancel={() => setAddingCard(false)} />
  ) : (
    <Button
      colorScheme={"gray"}
      onClick={() => setAddingCard(true)}
      leftIcon={<AddIcon />}
      fontSize={"sm"}
      size={"sm"}
    >
      Add a card
    </Button>
  );
};
