import { Box, Heading, VStack } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";
import { TCard, TColumn } from "../types";
import { Card } from "./Card";

interface ColumnProps {
  column: TColumn;
  cards: TCard[];
}

export const Column = ({ column, cards }: ColumnProps) => {
  return (
    <Box minW={"2xs"}>
      <Heading
        fontSize={"lg"}
        mb={3}
        bg={"gray.200"}
        px={3}
        py={2}
        borderRadius={"sm"}
      >
        {column.title}
      </Heading>

      <Droppable droppableId={`${column.id}`}>
        {({ innerRef, droppableProps, placeholder }) => (
          <VStack
            spacing={3}
            justifyContent={"stretch"}
            alignItems={"stretch"}
            ref={innerRef}
            {...droppableProps}
          >
            {cards.map((card, index) => (
              <Card {...card} index={index} key={card.id} />
            ))}

            {placeholder}
          </VStack>
        )}
      </Droppable>
    </Box>
  );
};
