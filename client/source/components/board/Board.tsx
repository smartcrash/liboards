import { Box, HStack } from "@chakra-ui/react";
import { cloneDeep } from "lodash-es";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import useRefState from "../../hooks/useRefState";
import { Card, Column } from "./components";
import { CardAdder } from "./components/CardAdder";
import { ColumnAdder } from "./components/ColumnAdder";
import { addCard, addColumn, moveCard } from "./helpers";
import { BoardType, CardType, ColumnType } from "./types";

export type ColumnNewHandler = (newColumn: { title: string }) => Promise<ColumnType>;

export type CardNewHandler = (newCard: { title: string; columnId: number }) => Promise<CardType>;

export type CardDragEndHandler = (result: {
  cardId: number;
  fromColumnId: number;
  toColumnId: number;
  fromIndex: number;
  toIndex: number;
}) => void;

interface BoardProps {
  children: BoardType;
  onColumnNew: ColumnNewHandler;
  onCardNew: CardNewHandler;
  onCardDragEnd: CardDragEndHandler;
}

export const Board = ({ children: initialBoard, onColumnNew, onCardNew, onCardDragEnd }: BoardProps) => {
  const columnWidth = "2xs";

  const [boardRef, setBoardRef] = useRefState(() => {
    const board = cloneDeep(initialBoard);
    board.columns.forEach((column) => column.cards.sort((a, b) => a.index - b.index));
    return board;
  });

  const handleColumnAdd = async (title: string) => {
    const board = boardRef.current;
    const column = await onColumnNew({ title });
    const boardWithNewColumn = addColumn(board, column);
    setBoardRef(boardWithNewColumn);
  };

  const handleCardAdd = async (column: ColumnType, { title }: { title: string }) => {
    const board = boardRef.current;
    const card = await onCardNew({ title, columnId: column.id });
    const boardWithNewCard = addCard(board, column, card);
    setBoardRef(boardWithNewCard);
  };

  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    // Sometimes the destination may be `null` such as when the user
    // drops outside of a list.
    if (!destination) return;

    const board = boardRef.current;
    const cardId = parseInt(draggableId);
    const fromColumnId = parseInt(source.droppableId);
    const toColumnId = parseInt(destination.droppableId);
    const fromIndex = source.index;
    const toIndex = destination.index;

    // If this expression is true means that the user
    // dropped the draggable on the same place that started.
    // So we do not need to do anithing.
    if (fromColumnId === toColumnId && fromIndex === toIndex) return;

    const boardWithMovedCard = moveCard(board, {
      fromColumnId,
      fromIndex,
      toColumnId,
      toIndex,
    });
    setBoardRef(boardWithMovedCard);

    onCardDragEnd({ cardId, fromColumnId, toColumnId, fromIndex, toIndex });
  };

  return (
    <HStack justifyContent={"flex-start"} alignItems={"start"}>
      <DragDropContext onDragEnd={onDragEnd}>
        {boardRef.current.columns.map((column, columnIndex) => {
          return (
            <Box minW={columnWidth} key={column.id}>
              <Column title={column.title} droppableId={`${column.id}`} data-testid={`column-${columnIndex}`}>
                {column.cards.map((card, cardIndex) => (
                  <Card
                    title={card.title}
                    description={card.description}
                    draggableId={`${card.id}`}
                    index={cardIndex}
                    key={card.id}
                    data-testid={`card-${cardIndex}`}
                  />
                ))}
              </Column>

              <CardAdder onConfirm={(title) => handleCardAdd(column, { title })} />
            </Box>
          );
        })}

        <Box minW={columnWidth}>
          <ColumnAdder onConfirm={handleColumnAdd} />
        </Box>
      </DragDropContext>
    </HStack>
  );
};
