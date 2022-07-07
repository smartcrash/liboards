import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { fireEvent } from "../../../utils/testUtils";
import { CardModalHeader } from "../src/CardModalHeader";
import { customRender } from "../testUtils";

describe("<CardModalHeader />", () => {
  it("renders", () => {
    customRender(<CardModalHeader />);
  });

  it("shows card's title and description", () => {
    const { getAllByText, card } = customRender(<CardModalHeader />);

    expect(getAllByText(card.title).length).toBeTruthy();
    expect(getAllByText(card.description).length).toBeTruthy();
  });

  it("updates card's title", () => {
    const nextValue = faker.lorem.words();
    const { getByDisplayValue, card, updateCard } = customRender(<CardModalHeader />);

    const input = getByDisplayValue(card.title);

    fireEvent.change(input, { target: { value: nextValue } });
    fireEvent.blur(input);

    expect(updateCard).toHaveBeenCalled();
    expect(updateCard).toHaveBeenLastCalledWith({ id: card.id, title: nextValue });
  });

  it("updates card's description", () => {
    const nextValue = faker.lorem.words();
    const { getByDisplayValue, card, updateCard } = customRender(<CardModalHeader />);

    const input = getByDisplayValue(card.description);

    fireEvent.change(input, { target: { value: nextValue } });
    fireEvent.blur(input);

    expect(updateCard).toHaveBeenCalled();
    expect(updateCard).toHaveBeenLastCalledWith({ id: card.id, description: nextValue });
  });
});
