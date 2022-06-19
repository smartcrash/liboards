import {
  Box,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { cloneDeep } from "lodash-es";
import { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { NonEmptyEditable } from "../";
import useRefState from "../../hooks/useRefState";
import { DotsHorizontal } from "../../icons";
import { Card, Column } from "./components";
import { CardAdder } from "./components/CardAdder";
import { ColumnAdder } from "./components/ColumnAdder";
import { addCard, addColumn, changeColumn, moveCard, removeCard, removeColumn } from "./helpers";
import { BoardType, CardType, ColumnType } from "./types";

export type ColumnNewHandler = (newColumn: { title: string }) => Promise<ColumnType>;

export type ColumnRemoveHandler = (column: ColumnType) => void;

export type ColumnRenameHandler = (renamedColumn: ColumnType) => void;

export type CardNewHandler = (newCard: { title: string; columnId: number }) => Promise<CardType>;

export type CardRemoveHandler = (card: CardType) => void;

export type CardClickHandler = (card: CardType, column: ColumnType) => void;

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
  onColumnRemove: ColumnRemoveHandler;
  onColumnRename: ColumnRenameHandler;
  onCardNew: CardNewHandler;
  onCardRemove: CardRemoveHandler;
  onCardDragEnd: CardDragEndHandler;
  onCardClick: CardClickHandler;
}

export const Board = ({
  children: initialBoard,
  onColumnNew,
  onCardNew,
  onColumnRemove,
  onColumnRename,
  onCardRemove,
  onCardDragEnd,
  onCardClick,
}: BoardProps) => {
  const columnWidth = "2xs";
  const [boardRef, setBoardRef] = useRefState<BoardType>({ columns: [] });

  useEffect(() => {
    const board = cloneDeep(initialBoard);
    board.columns.forEach((column) => column.cards.sort((a, b) => a.index - b.index));
    setBoardRef(board);
  }, [initialBoard]);

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

  const handleColumnRemove = async (column: ColumnType) => {
    const board = boardRef.current;
    const filteredBoard = removeColumn(board, column);
    onColumnRemove(column);
    setBoardRef(filteredBoard);
  };

  const handleCardRemove = async (column: ColumnType, card: CardType) => {
    const board = boardRef.current;
    const boardWithoutCard = removeCard(board, column, card);
    onCardRemove(card);
    setBoardRef(boardWithoutCard);
  };

  const handleColumnRename = async (column: ColumnType, title: string) => {
    if (column.title === title) return;

    const board = boardRef.current;
    const boardWithRenamedColumn = changeColumn(board, column, { title });
    onColumnRename({ ...column, title });
    setBoardRef(boardWithRenamedColumn);
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
            <Stack w={columnWidth} key={column.id}>
              <Column
                droppableId={`${column.id}`}
                columnHeader={
                  <NonEmptyEditable
                    defaultValue={column.title}
                    onSubmit={(nextValue) => handleColumnRename(column, nextValue)}
                    fontSize={"md"}
                    fontWeight={"semibold"}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </NonEmptyEditable>
                }
                contextMenu={
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<DotsHorizontal fontSize={"xl"} color={"gray.500"} />}
                      variant={"ghost"}
                      size={"sm"}
                      colorScheme={"gray"}
                      aria-label={"More column actions"}
                      title={"More column actions"}
                    />
                    <MenuList>
                      <MenuItem data-testid={"remove-column"} onClick={() => handleColumnRemove(column)}>
                        Delete this column
                      </MenuItem>
                    </MenuList>
                  </Menu>
                }
                data-testid={`column-${columnIndex}`}
              >
                {column.cards.map((card, cardIndex) => (
                  <Card
                    title={card.title}
                    description={card.description}
                    draggableId={`${card.id}`}
                    index={cardIndex}
                    onClick={() => onCardClick(card, column)}
                    onRemove={() => handleCardRemove(column, card)}
                    key={card.id}
                    data-testid={`card-${cardIndex}`}
                  />
                ))}
              </Column>

              <CardAdder onConfirm={(title) => handleCardAdd(column, { title })} />
            </Stack>
          );
        })}

        <Box w={columnWidth}>
          <ColumnAdder onConfirm={handleColumnAdd} />
        </Box>
      </DragDropContext>
    </HStack>
  );
};
