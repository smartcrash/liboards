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
import { Draggable } from "react-beautiful-dnd";
import { useHover } from "../../../hooks";
import { DotsHorizontalIcon } from "../../../icons";

interface CardProps extends BoxProps {
  title: string;
  description: string;
  index: number;
  draggableId: string;
  onRemove: () => void;
}

export const Card = ({ title, description, index, draggableId, onRemove, ...boxProps }: CardProps) => {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Draggable draggableId={draggableId} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Box ref={innerRef} {...boxProps} {...draggableProps} {...dragHandleProps}>
          <Box py={3} px={3} borderWidth={1} borderRadius={"sm"} bg={"white"} position={"relative"} ref={hoverRef}>
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
        </Box>
      )}
    </Draggable>
  );
};
