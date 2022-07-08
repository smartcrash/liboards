import { faker } from "@faker-js/faker";
import { ReactElement } from "react";
import { vi } from "vitest";
import { render } from "../../utils/testUtils";
import { CardModalContextProvider, CardType } from "./src/CardModal";

type TComment = CardType["comments"][0];

export const createRandomCard = (overrides: Partial<CardType> = {}): CardType => ({
  id: faker.datatype.number(),
  title: faker.lorem.words(),
  description: faker.lorem.sentences(),
  column: {
    id: faker.datatype.number(),
    title: faker.lorem.words(),
  },
  comments: [],
  tasks: [],
  ...overrides,
});

export const createRadomComment = (overrides: Partial<TComment> = {}): TComment => ({
  id: faker.datatype.number(),
  content: faker.lorem.words(),
  user: {
    id: faker.datatype.number(),
    userName: faker.internet.userName(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  canDelete: true,
  canUpdate: true,
  ...overrides,
});

export const customRender = (ui: ReactElement, card: CardType = createRandomCard()) => {
  const mutations = {
    updateCard: vi.fn(),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    removeTask: vi.fn(),
    addComment: vi.fn(),
    updateComment: vi.fn(),
    removeComment: vi.fn(),
  };

  const renderResult = render(<CardModalContextProvider value={{ card, ...mutations }}>{ui}</CardModalContextProvider>);

  return {
    card,
    ...mutations,
    ...renderResult,
  };
};
