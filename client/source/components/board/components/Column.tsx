import { Box, BoxProps, Heading, VStack } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";

interface ColumnProps extends BoxProps {
  title: string;
  droppableId: string;
  children: any;
}

export const Column = ({ title, droppableId, children, ...boxProps }: ColumnProps) => {
  return (
    <Box {...boxProps}>
      <Heading fontSize={"lg"} mb={3} bg={"gray.200"} px={3} py={2} borderRadius={"sm"}>
        {title}
      </Heading>

      <Droppable droppableId={droppableId}>
        {({ innerRef, droppableProps, placeholder }) => (
          <VStack spacing={3} justifyContent={"stretch"} alignItems={"stretch"} ref={innerRef} {...droppableProps}>
            {children}
            {placeholder}
          </VStack>
        )}
      </Droppable>
    </Box>
  );
};
