import {
  Box,
  BoxProps,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useFindCardByIdQuery } from "../../../generated/graphql";
import { useHover } from "../../../hooks";
import { DotsHorizontalIcon } from "../../../icons";

interface CardProps {
  id: number;
  onRemove: () => void;
  onClick: () => void;
}

export const Card = ({ id, onRemove, onClick }: CardProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data, fetching }] = useFindCardByIdQuery({ variables: { id } });

  if (fetching) return <>Loading...</>; // TODO: Show skeleton
  if (!data || !data.card) return <>Error: Card not found :c</>; // TODO: Handle error

  const { title, description } = data.card;

  return (
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
        display={isHover || isOpen ? "block" : "none"}
        position={"absolute"}
        top={1}
        right={1}
        onClick={(event) => event.stopPropagation()}
        bg={"white"}
      >
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
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
            <MenuItem data-testid={"remove-card"} onClick={onRemove}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Stack>
        <Heading as={"h4"} fontSize={"md"} maxW={"full"} whiteSpace={"pre-wrap"} fontWeight={"medium"}>
          {title}
        </Heading>
        <Text fontSize={"sm"} color={"gray.500"} hidden={!description} noOfLines={5}>
          {description}
        </Text>
      </Stack>
    </Box>
  );
};
