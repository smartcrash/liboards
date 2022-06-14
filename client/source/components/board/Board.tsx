import { Box, HStack } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column as ColumnType } from "../../generated/graphql";
import { Card, Column } from "./components";
import { CardAdder } from "./components/CardAdder";
import { ColumnAdder } from "./components/ColumnAdder";

export type ColumnNewHandler = (newColumn: {
  title: string;
  index: number;
}) => void;

export type CardNewHandler = (newCard: {
  title: string;
  index: number;
  columnId: number;
}) => void;

export type CardDragEndHandler = (result: {
  cardId: number;
  fromColumnId: number;
  toColumnId: number;
  fromIndex: number;
  toIndex: number;
}) => void;

interface BoardProps {
  columns: ColumnType[];
  onColumnNew: ColumnNewHandler;
  onCardNew: CardNewHandler;
  onCardDragEnd: CardDragEndHandler;
}

export const Board = ({
  columns,
  onColumnNew,
  onCardNew,
  onCardDragEnd,
}: BoardProps) => {
  const columnWidth = "2xs";

  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    // Sometimes the destination may be `null` such as when the user
    // drops outside of a list.
    if (!destination) return;

    const cardId = parseInt(draggableId);
    const fromColumnId = parseInt(source.droppableId);
    const toColumnId = parseInt(destination.droppableId);
    const fromIndex = source.index;
    const toIndex = destination.index;

    // If this expression is true means that the user
    // dropped the draggable on the same place that started.
    // So we do not need to do anithing.
    if (fromColumnId === toColumnId && fromIndex === toIndex) return;

    onCardDragEnd({ cardId, fromColumnId, toColumnId, fromIndex, toIndex });
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

              <CardAdder
                onConfirm={(title) =>
                  onCardNew({
                    title,
                    index: cards.length,
                    columnId: column.id,
                  })
                }
              />
            </Box>
          );
        })}

        <Box minW={columnWidth}>
          <ColumnAdder
            onConfirm={(title) => onColumnNew({ title, index: columns.length })}
          />
        </Box>
      </DragDropContext>
    </HStack>
  );
};
