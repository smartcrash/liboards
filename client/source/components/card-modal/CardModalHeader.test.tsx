import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "../../utils/testUtils";
import { CardModalContextProvider, CardType } from "./CardModal";
import { CardModalHeader } from "./CardModalHeader";

const createMockCard = (): CardType => ({
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

const customRender = () => {
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
      <CardModalHeader />
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

describe("<CardModalHeader />", () => {
  it("renders", () => {
    customRender();
  });

  it("shows card's title and description", () => {
    const { getAllByText, card } = customRender();

    expect(getAllByText(card.title).length).toBeTruthy();
    expect(getAllByText(card.description).length).toBeTruthy();
  });

  it("updates card's title", () => {
    const nextValue = faker.lorem.words();
    const { getByDisplayValue, card, updateCard } = customRender();

    const input = getByDisplayValue(card.title);

    fireEvent.change(input, { target: { value: nextValue } });
    fireEvent.blur(input);

    expect(updateCard).toHaveBeenCalled();
    expect(updateCard).toHaveBeenLastCalledWith({ id: card.id, title: nextValue });
  });

  it("updates card's description", () => {
    const nextValue = faker.lorem.words();
    const { getByDisplayValue, card, updateCard } = customRender();

    const input = getByDisplayValue(card.description);

    fireEvent.change(input, { target: { value: nextValue } });
    fireEvent.blur(input);

    expect(updateCard).toHaveBeenCalled();
    expect(updateCard).toHaveBeenLastCalledWith({ id: card.id, description: nextValue });
  });
});
