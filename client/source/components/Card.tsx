import { ChatIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useFindCardByIdQuery } from "../generated/graphql";
import { useHover } from "../hooks";
import { CheckSquareIcon, DotsHorizontalIcon } from "../icons";
import { ConfirmAlertDialog } from "./ConfirmAlertDialog";

interface CardProps {
  id: number;
  onRemove: () => void;
  onClick: () => void;
}

export const Card = ({ id, onRemove, onClick }: CardProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const { isOpen: isDialogOpen, onOpen: onOpenDialog, onClose: onDialogClose } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const [{ data, fetching }] = useFindCardByIdQuery({ variables: { id } });

  if (fetching)
    return (
      <Box py={4} px={3} borderWidth={1} borderRadius={"sm"} bg={"white"}>
        <Skeleton height={"15px"} mb={3} />
        <SkeletonText noOfLines={2} />
      </Box>
    );
  if (!data || !data.card) return <>Error: Card not found :c</>; // TODO: Handle error

  const { title, tasks, comments } = data.card;

  const metaTags: { icon: JSX.Element; label: string | number; visible: boolean }[] = [
    {
      label: tasks.filter(({ completed }) => completed).length + "/" + tasks.length,
      icon: <CheckSquareIcon fontSize={"sm"} aria-label={`${tasks.length} task(s)`} />,
      visible: !!tasks.length,
    },
    {
      label: comments.length,
      icon: <ChatIcon aria-label={`${comments.length} comment(s)`} />,
      visible: !!comments.length,
    },
  ];

  return (
    <>
      <Box
        py={3}
        px={3}
        borderWidth={1}
        borderRadius={"sm"}
        bg={"white"}
        position={"relative"}
        ref={hoverRef}
        onClick={onClick}
      >
        <Box
          display={isHover || isMenuOpen ? "block" : "none"}
          position={"absolute"}
          top={1}
          right={1}
          onClick={(event) => event.stopPropagation()}
          bg={"white"}
        >
          <Menu isOpen={isMenuOpen} onOpen={onMenuOpen} onClose={onMenuClose}>
            <MenuButton
              as={IconButton}
              icon={<DotsHorizontalIcon fontSize={"lg"} color={"gray.500"} />}
              variant={"ghost"}
              size={"sm"}
              colorScheme={"gray"}
              aria-label={"More card actions"}
              title={"More card actions"}
            />
            <MenuList>
              <MenuItem data-testid={"remove-card"} onClick={onOpenDialog}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        <Stack>
          <Heading as={"h4"} fontSize={"md"} maxW={"full"} whiteSpace={"pre-wrap"} fontWeight={"medium"}>
            {title}
          </Heading>

          {metaTags.some(({ visible }) => visible) && (
            <HStack spacing={3} pt={2}>
              {metaTags
                .filter(({ visible }) => visible)
                .map(({ label, icon }) => (
                  <HStack fontSize={"xs"} spacing={1} color={"gray.500"} _hover={{ color: "gray.900" }} key={label}>
                    {icon}
                    <Text aria-hidden>{label}</Text>
                  </HStack>
                ))}
            </HStack>
          )}
        </Stack>
      </Box>

      <ConfirmAlertDialog
        isOpen={isDialogOpen}
        onClose={onDialogClose}
        confirmLabel={"Delete"}
        onConfirm={onRemove}
        contentProps={{ "data-testid": "confirm-remove-card-alert-dialog" } as any}
      >
        Are you sure you want to delete <strong>{title}</strong>?
      </ConfirmAlertDialog>
    </>
  );
};
