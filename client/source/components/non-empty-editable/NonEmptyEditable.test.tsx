import { EditableInput, EditablePreview } from "@chakra-ui/react";
import { describe, it, vi, expect } from "vitest";
import { render, userEvent, fireEvent } from "../../utils/testUtils";
import { NonEmptyEditable } from "./NonEmptyEditable";

describe("NonEmptyEditable", () => {
  it.concurrent("should not invoce `onSubmit` when the input is left empty", async () => {
    const onSubmit = vi.fn();
    const defaultValue = "I'm awesome";

    const { getByDisplayValue } = render(
      <NonEmptyEditable defaultValue={defaultValue} onSubmit={onSubmit}>
        <EditablePreview />
        <EditableInput />
      </NonEmptyEditable>
    );

    const input = getByDisplayValue(defaultValue) as HTMLInputElement;

    userEvent.clear(input);
    expect(input.value).toBe("");

    fireEvent.blur(input);
    expect(onSubmit).not.toBeCalled();
    expect(input.value).toBe(defaultValue);
  });

  it.concurrent("should display previous value on edit cancelation", () => {
    const onSubmit = vi.fn();
    const defaultValue = "I'm awesome";

    const { getByDisplayValue, getByText } = render(
      <NonEmptyEditable defaultValue={defaultValue} onSubmit={onSubmit}>
        <EditablePreview />
        <EditableInput />
      </NonEmptyEditable>
    );

    const preview = getByText(defaultValue);
    const input = getByDisplayValue(defaultValue) as HTMLInputElement;

    fireEvent.click(preview);
    fireEvent.change(input, { target: { value: "I'm not that awesome" } });
    expect(input.value).toBe("I'm not that awesome");

    fireEvent.keyDown(input, { key: "Escape", keyCode: 27 });

    expect(input.value).toBe(defaultValue);
  });
});
