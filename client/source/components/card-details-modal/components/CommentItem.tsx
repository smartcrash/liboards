import { Avatar, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { CommentFragmentFragment } from "../../../generated/graphql";

interface CommentItemProps {
  comment: CommentFragmentFragment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { content, user, createdAt } = comment;

  return (
    <HStack alignItems={"flex-start"} spacing={4}>
      <Avatar size={"sm"} />

      <VStack alignItems={"flex-start"}>
        <HStack alignItems={"center"}>
          <Heading as="h6" size="xs" lineHeight={"shorter"}>
            {user.username}
          </Heading>
          <Text fontSize={"xs"} color={"gray.500"} lineHeight={"shorter"}>
            {createdAt}
          </Text>
        </HStack>

        <Text fontSize={"sm"}>{content}</Text>
      </VStack>
    </HStack>
  );
};
