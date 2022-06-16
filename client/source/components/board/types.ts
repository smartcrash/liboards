export type BoardType = { columns: ColumnType[] };

export type CardType = {
  id: number,
  title: string,
  description: string,
  index: number
}

export type ColumnType = {
  id: number;
  title: string;
  index: number,
  cards: CardType[]
}
