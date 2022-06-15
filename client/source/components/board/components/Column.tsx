import { Box, BoxProps, Heading, HStack, VStack } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";

interface ColumnProps extends BoxProps {
  title: string;
  droppableId: string;
  contextMenu: any;
  children: any;
}

export const Column = ({ title, droppableId, contextMenu, children, ...boxProps }: ColumnProps) => {
  return (
    <Box {...boxProps}>
      <HStack mb={3} bg={"gray.200"} px={3} py={2} borderRadius={"sm"} justifyContent={"space-between"}>
        <Heading fontSize={"lg"}>{title}</Heading>
        {contextMenu}
      </HStack>

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
