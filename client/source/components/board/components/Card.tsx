import { Box, BoxProps, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

interface CardProps extends BoxProps {
  title: string;
  description: string;
  index: number;
  draggableId: string;
  contextMenu: any;
}

export const Card = ({ title, description, index, draggableId, contextMenu, ...boxProps }: CardProps) => {
  const [isHover, setHover] = useState(false);

  return (
    <Draggable draggableId={draggableId} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Box
          py={3}
          px={3}
          borderWidth={1}
          bg={"white"}
          ref={innerRef}
          position={"relative"}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          {...boxProps}
          {...draggableProps}
          {...dragHandleProps}
        >
          <Box
            display={isHover ? "block" : "none"}
            position={"absolute"}
            top={1}
            right={1}
            onClick={(event) => event.stopPropagation()}
            bg={"white"}
          >
            {contextMenu}
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
      )}
    </Draggable>
  );
};
