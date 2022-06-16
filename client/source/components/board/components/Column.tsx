import { Box, BoxProps, HStack, VStack } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";

interface ColumnProps extends BoxProps {
  columnHeader: any;
  droppableId: string;
  contextMenu: any;
  children: any;
}

export const Column = ({ columnHeader, droppableId, contextMenu, children, ...boxProps }: ColumnProps) => {
  return (
    <Box {...boxProps}>
      <HStack mb={3} px={3} py={2} justifyContent={"space-between"}>
        {columnHeader}
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
