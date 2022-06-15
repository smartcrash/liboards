import { Box, BoxProps, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";

interface CardProps extends BoxProps {
  title: string;
  description: string;
  index: number;
  draggableId: string;
  contextMenu: any;
}

export const Card = ({ title, description, index, draggableId, contextMenu, ...boxProps }: CardProps) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Box
          py={3}
          px={3}
          borderWidth={1}
          bg={"white"}
          ref={innerRef}
          {...boxProps}
          {...draggableProps}
          {...dragHandleProps}
        >
          <Stack>
            <HStack>
              <Heading fontSize={"md"}>{title}</Heading>
              {contextMenu}
            </HStack>
            <Text fontSize={"sm"} color={"gray.500"}>
              {description}
            </Text>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
};
