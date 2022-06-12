import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { TCard } from "../types";
import { Draggable } from "react-beautiful-dnd";

interface CardProps extends TCard {
  index: number;
}

export const Card = ({ id, description, title, index }: CardProps) => {
  return (
    <Draggable draggableId={`${id}`} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Box
          py={3}
          px={3}
          borderWidth={1}
          bg={"white"}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
        >
          <Stack>
            <Heading fontSize={"md"}>{title}</Heading>
            <Text fontSize={"sm"} color={"gray.500"}>
              {description}
            </Text>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
};
