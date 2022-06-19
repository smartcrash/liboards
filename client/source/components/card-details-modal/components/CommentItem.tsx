import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";
import { CommentFragmentFragment } from "../../../generated/graphql";
import { CommentControls } from "./CommentControls";
import { CommentEditForm } from "./CommentEditForm";

interface CommentItemProps {
  comment: CommentFragmentFragment;
  onEdit: (content: string) => void;
  onRemove: () => void;
}

export const CommentItem = ({ comment, onEdit, onRemove }: CommentItemProps) => {
  const { content, user, createdAt, canUpdate, canDelete } = comment;
  const [isEditing, setEditing] = useState(false);

  const confirmEdit = (content: string) => {
    onEdit(content);
    setEditing(false);
  };

  return (
    <HStack alignItems={"flex-start"} spacing={4}>
      <Avatar size={"sm"} />

      <VStack alignItems={"flex-start"} flexGrow={1}>
        {!isEditing ? (
          <>
            <HStack alignItems={"center"}>
              <Heading as="h6" size="xs" lineHeight={"shorter"}>
                {user.username}
              </Heading>
              <Text fontSize={"xs"} color={"gray.500"} lineHeight={"shorter"}>
                {format(new Date(createdAt), "MMM d p")}
              </Text>
            </HStack>

            <Text fontSize={"sm"} whiteSpace={"pre-wrap"} w={"full"}>
              {content}
            </Text>

            <CommentControls
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={() => setEditing(true)}
              onRemove={onRemove}
            />
          </>
        ) : (
          <>
            {/*
              NOTE: Here we may reuse the <CommentForm/> to edit the comment due
                    is very similar to <CommentEditForm/>, but we might add
                    more functionality to <CommentForm/> like attachments and
                    grow in complexity, while <CommentEditForm/> will always
                    be this simple.
                    That's why I didn't reuse the <CommentForm/> component for
                    editing.
           */}
            <CommentEditForm
              defaultValue={comment.content}
              onConfirm={confirmEdit}
              onCancel={() => setEditing(false)}
            />
          </>
        )}
      </VStack>
    </HStack>
  );
};
