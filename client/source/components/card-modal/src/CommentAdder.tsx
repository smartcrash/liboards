import { Avatar, HStack } from "@chakra-ui/react";
import { CommentForm } from "./CommentForm";

interface CommentAdderProps {
  onConfirm: (content: string) => Promise<any | void> | void;
}

export const CommentAdder = ({ onConfirm }: CommentAdderProps) => {
  return (
    <HStack alignItems={"flex-start"} spacing={4}>
      <Avatar size={"sm"} />
      <CommentForm onConfirm={onConfirm} />
    </HStack>
  );
};
