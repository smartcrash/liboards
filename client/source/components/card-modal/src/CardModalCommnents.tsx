import { Heading, HStack, Spacer, Stack, Text } from "@chakra-ui/react";
import { orderBy } from "lodash";
import { useCardModalContext } from "./CardModal";
import { CommentAdder } from "./CommentAdder";
import { CommentItem } from "./CommentItem";

export const CardModalCommnents = () => {
  const { card, addComment, updateComment, removeComment } = useCardModalContext();
  const { id, comments } = card;

  return (
    <>
      {!!comments.length && (
        <>
          <HStack alignItems={"center"}>
            <Heading as="h6" size="xs">
              Comments
            </Heading>
            <Text fontSize={"xs"} color={"gray.500"}>
              {comments.length}
            </Text>
          </HStack>

          <Spacer h={5} />

          <Stack spacing={5}>
            {orderBy(comments, ({ createdAt }) => new Date(createdAt), "desc").map((comment) => (
              <CommentItem
                comment={comment}
                onEdit={(content) => updateComment({ ...comment, content })}
                onRemove={() => removeComment(comment)}
                key={comment.id}
              />
            ))}
          </Stack>

          <Spacer h={5} />
        </>
      )}

      <CommentAdder onConfirm={(content) => addComment({ content, cardId: id })} />
    </>
  );
};
