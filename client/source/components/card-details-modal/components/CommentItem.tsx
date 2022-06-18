import { Avatar, Button, ButtonGroup, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { CommentFragmentFragment } from "../../../generated/graphql";

interface CommentItemProps {
  comment: CommentFragmentFragment;
  onRemove: () => void;
}

export const CommentItem = ({ comment, onRemove }: CommentItemProps) => {
  const { content, user, createdAt } = comment;
  // TODO: Use authorization flag from server
  const canUpdate = true;
  const canDelete = true;

  return (
    <HStack alignItems={"flex-start"} spacing={4}>
      <Avatar size={"sm"} />

      <VStack alignItems={"flex-start"} w={"full"}>
        <HStack alignItems={"center"}>
          <Heading as="h6" size="xs" lineHeight={"shorter"}>
            {user.username}
          </Heading>
          <Text fontSize={"xs"} color={"gray.500"} lineHeight={"shorter"}>
            {createdAt}
          </Text>
        </HStack>

        <Text fontSize={"sm"} whiteSpace={"pre-wrap"} w={"full"}>
          {content}
        </Text>

        <ButtonGroup alignSelf={"flex-end"} size={"xs"} variant={"link"} colorScheme={"gray"}>
          <Button fontWeight={"light"} hidden={!canUpdate}>
            Edit
          </Button>
          <Button fontWeight={"light"} hidden={!canDelete} onClick={onRemove}>
            Delete
          </Button>
        </ButtonGroup>
      </VStack>
    </HStack>
  );
};
