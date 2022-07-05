import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { CardForm } from "./CardForm";

interface CardAdderProps {
  onConfirm: (title: string) => void;
}

export const CardAdder = ({ onConfirm }: CardAdderProps) => {
  const [isAddingCard, setAddingCard] = useState(false);

  const confirmColumn = (title: string) => onConfirm(title);

  return isAddingCard ? (
    <CardForm onConfirm={confirmColumn} onCancel={() => setAddingCard(false)} />
  ) : (
    <Button
      colorScheme={"gray"}
      variant={"outline"}
      onClick={() => setAddingCard(true)}
      leftIcon={<AddIcon />}
      fontSize={"sm"}
      size={"sm"}
      w={"full"}
      data-testid={"add-card"}
    >
      Add a card
    </Button>
  );
};
