import { TCard, TColumn } from "./types";

export const initialData: {
  cards: Record<number, TCard>;
  columns: Record<number, TColumn>;
  columnOrder: TColumn["id"][];
} = {
  cards: {
    1: {
      id: 1,
      title: "Hello",
      description: "I just say Hi",
      createdAt: new Date().toISOString(),
    },
    2: {
      id: 2,
      title: "This does not work",
      description: "Fix this ASAP!",
      createdAt: new Date().toISOString(),
    },
  },

  columns: {
    1: {
      id: 1,
      title: "To do",
      cardIds: [1, 2],
    },
  },

  columnOrder: [1],
};
