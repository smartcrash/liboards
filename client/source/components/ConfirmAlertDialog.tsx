import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
  ButtonGroup,
  ModalContentProps,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ConfirmAlertProps extends Omit<AlertDialogProps, "leastDestructiveRef"> {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** The props to forward to the dialog's content wraper */
  contentProps?: ModalContentProps;
}

export const ConfirmAlertDialog = ({
  isOpen,
  onClose,
  onConfirm = () => {},
  onCancel = () => {},
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  contentProps,
  children,
  ...alertDialogProps
}: ConfirmAlertProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} {...alertDialogProps}>
      <AlertDialogOverlay>
        <AlertDialogContent {...contentProps}>
          <AlertDialogCloseButton />

          <AlertDialogHeader fontSize="lg" fontWeight="bold"></AlertDialogHeader>

          <AlertDialogBody>{children}</AlertDialogBody>

          <AlertDialogFooter>
            <ButtonGroup spacing={3} size={"sm"}>
              <Button ref={cancelRef} onClick={handleCancel} variant={"ghost"} colorScheme={"gray"}>
                {cancelLabel}
              </Button>
              <Button colorScheme={"red"} onClick={handleConfirm}>
                {confirmLabel}
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
