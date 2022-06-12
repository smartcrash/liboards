import { Box } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "./components";
import { initialData } from "./initialData";

export const Board = () => {
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
    <Box display={"flex"} justifyContent={"center"}>
      <DragDropContext onDragEnd={onDragEnd}>
        {initialData.columnOrder.map((id) => {
          const column = initialData.columns[id];
          const cards = column.cardIds.map(
            (cardId) => initialData.cards[cardId]
          );

          return <Column column={column} cards={cards} key={id} />;
        })}
      </DragDropContext>
    </Box>
  );
};
