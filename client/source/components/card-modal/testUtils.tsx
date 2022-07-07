import { faker } from "@faker-js/faker";
import { ReactElement } from "react";
import { vi } from "vitest";
import { render } from "../../utils/testUtils";
import { CardModalContextProvider, CardType } from "./src/CardModal";

export const createMockCard = (): CardType => ({
  id: faker.datatype.number(),
  title: faker.lorem.words(),
  description: faker.lorem.sentences(),
  column: {
    id: faker.datatype.number(),
    title: faker.lorem.words(),
  },
  comments: [],
  tasks: [],
});

export const customRender = (ui: ReactElement) => {
  const card = createMockCard();
  const updateCard = vi.fn();
  const addTask = vi.fn();
  const updateTask = vi.fn();
  const removeTask = vi.fn();
  const addComment = vi.fn();
  const updateComment = vi.fn();
  const removeComment = vi.fn();

  const renderResult = render(
    <CardModalContextProvider
      value={{
        card,
        updateCard,
        addTask,
        updateTask,
        removeTask,
        addComment,
        updateComment,
        removeComment,
      }}
    >
      {ui}
    </CardModalContextProvider>
  );

  return {
    card,
    updateCard,
    addTask,
    updateTask,
    removeTask,
    addComment,
    updateComment,
    removeComment,
    ...renderResult,
  };
};
