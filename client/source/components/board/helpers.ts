import { BoardType, CardType, ColumnType } from "./types";

export const moveCard = (
  board: BoardType,
  {
    fromColumnId,
    fromIndex,
    toColumnId,
    toIndex,
  }: {
    fromIndex: number;
    fromColumnId: number;
    toIndex: number;
    toColumnId: number;
  }
): BoardType => {
  const sourceColumn = board.columns.find(({ id }) => id === fromColumnId)!
  const destinationColumn = board.columns.find(({ id }) => id === toColumnId)!

  const sourceCards = sourceColumn.cards;
  const destinationCards = destinationColumn.cards;
  const card = sourceCards[fromIndex];

  sourceCards.splice(fromIndex, 1);
  destinationCards.splice(toIndex, 0, card);

  return board;
};

export const addColumn = (board: BoardType, column: ColumnType): BoardType => ({
  ...board,
  columns: [...board.columns, column],
});

export const addCard = (board: BoardType, inColumn: ColumnType, card: CardType): BoardType => {
  const columnToAdd = board.columns.find(({ id }) => id === inColumn.id)!;
  const cards = [...columnToAdd.cards, card];
  columnToAdd.cards = cards;

  return { ...board };
};
