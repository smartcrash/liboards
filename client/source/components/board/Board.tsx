import { Box, HStack } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column as ColumnType } from "../../generated/graphql";
import { Card, Column } from "./components";
import { ColumnAdder } from "./components/ColumnAdder";

interface BoardProps {
  columns: ColumnType[];
  onColumnNew?: (newColumn: string) => void;
}

export const Board = ({ columns, onColumnNew = () => {} }: BoardProps) => {
  const columnWidth = "2xs";

  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    console.log({ draggableId, source, destination });

    if (!destination) return;

    // If this expression is true means that the user
    // dropped the draggable on the same place that started.
    // So we do not need to do anithing.
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // TODO: Persist card reorder
    const column = ``;
  };

  return (
    <HStack justifyContent={"flex-start"} alignItems={"start"}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map(({ cards, ...column }) => {
          return (
            <Box minW={columnWidth} key={column.id}>
              <Column title={column.title} droppableId={`${column.id}`}>
                {cards.map((card) => (
                  <Card
                    title={card.title}
                    description={card.description}
                    draggableId={`${card.id}`}
                    index={card.index}
                    key={card.id}
                  />
                ))}
              </Column>
            </Box>
          );
        })}

        <Box minW={columnWidth}>
          <ColumnAdder onConfirm={onColumnNew} />
        </Box>
      </DragDropContext>
    </HStack>
  );
};
