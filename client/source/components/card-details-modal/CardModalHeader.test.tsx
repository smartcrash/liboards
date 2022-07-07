import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "../../utils/testUtils";
import { CardType } from "./CardModal";
import { CardModalHeader } from "./CardModalHeader";

const mockedUpdateCard = vi.fn();

vi.mock("../../generated/graphql", () => ({ useUpdateCardMutation: () => [, mockedUpdateCard] }));

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

const mockCard = createMockCard();

const customRender = () => render(<CardModalHeader card={mockCard} />);

describe("<CardModalHeader />", () => {
  it("renders", () => {
    customRender();
  });

  it("shows card's title and description", () => {
    const { getAllByText } = customRender();

    expect(getAllByText(mockCard.title).length).toBeTruthy();
    expect(getAllByText(mockCard.description).length).toBeTruthy();
  });

  it("updates card's title", () => {
    const nextValue = faker.lorem.words();
    const { getByDisplayValue } = customRender();

    const input = getByDisplayValue(mockCard.title);

    fireEvent.change(input, { target: { value: nextValue } });
    fireEvent.blur(input);

    expect(mockedUpdateCard).toHaveBeenCalled();
    expect(mockedUpdateCard).toHaveBeenLastCalledWith({ id: mockCard.id, title: nextValue });
  });

  it("updates card's description", () => {
    const nextValue = faker.lorem.words();
    const { getByDisplayValue } = customRender();

    const input = getByDisplayValue(mockCard.description);

    fireEvent.change(input, { target: { value: nextValue } });
    fireEvent.blur(input);

    expect(mockedUpdateCard).toHaveBeenCalled();
    expect(mockedUpdateCard).toHaveBeenLastCalledWith({ id: mockCard.id, description: nextValue });
  });
});
