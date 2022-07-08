import { ButtonGroup, Button } from "@chakra-ui/react";

interface CommentControlsProps {
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

export const CommentControls = ({ canUpdate, canDelete, onEdit, onRemove }: CommentControlsProps) => {
  return (
    <ButtonGroup alignSelf={"flex-end"} size={"xs"} variant={"link"} colorScheme={"gray"}>
      {canUpdate && (
        <Button fontWeight={"light"} onClick={onEdit} data-testid={"edit-comment"}>
          Edit
        </Button>
      )}

      {canDelete && (
        <Button fontWeight={"light"} hidden={!canDelete} onClick={onRemove} data-testid={"delete-comment"}>
          Delete
        </Button>
      )}
    </ButtonGroup>
  );
};
