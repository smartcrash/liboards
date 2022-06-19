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
      <Button fontWeight={"light"} hidden={!canUpdate} onClick={onEdit}>
        Edit
      </Button>
      <Button fontWeight={"light"} hidden={!canDelete} onClick={onRemove}>
        Delete
      </Button>
    </ButtonGroup>
  );
};
