import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, userEvent, waitFor } from "../../utils/testUtils";
import { EditableMarkdown } from "./EditableMarkdown";

describe("<EditableMarkdown/>", () => {
  it("should show placeholder if `defaultValue` is empty", () => {
    const { getByTestId } = render(<EditableMarkdown defaultValue={""} onSubmit={() => {}} />);

    expect(getByTestId("placeholder")).toBeTruthy();
  });

  it("should enter edit mode when the placeholder is clicked", async () => {
    const { getByTestId, queryByTestId } = render(<EditableMarkdown defaultValue={""} onSubmit={() => {}} />);

    expect(queryByTestId("save")).toBeFalsy();
    expect(queryByTestId("cancel")).toBeFalsy();

    fireEvent.click(getByTestId("placeholder"));

    await waitFor(() => {
      getByTestId("save");
      getByTestId("cancel");
    });
  });

  it("should to `defaultValue` as text if not empty", () => {
    const defaultValue = "[Some random description]";
    const { queryByTestId, getByTestId } = render(<EditableMarkdown defaultValue={defaultValue} onSubmit={() => {}} />);

    const preview = getByTestId("preview");
    const textarea = getByTestId("textarea") as HTMLTextAreaElement;

    expect(queryByTestId("placeholder")).toBeFalsy();
    expect(preview.innerHTML).toContain(defaultValue);
    expect(textarea.value).toBe(defaultValue);
  });

  it("should enter edit mode when the `defaultValue` is clicked", async () => {
    const defaultValue = "[Some random description]";
    const { queryByTestId, getByTestId } = render(<EditableMarkdown defaultValue={defaultValue} onSubmit={() => {}} />);

    expect(queryByTestId("save")).toBeFalsy();
    expect(queryByTestId("cancel")).toBeFalsy();

    userEvent.click(getByTestId("preview"));

    getByTestId("textarea");

    await waitFor(() => {
      getByTestId("save");
      getByTestId("cancel");
    });
  });

  it("should invoce `onSubmit` when the `Save` button is pressed", async () => {
    const defaultValue = "[Some random description]";
    const onSubmit = vi.fn();

    const { getByTestId } = render(<EditableMarkdown defaultValue={defaultValue} onSubmit={onSubmit} />);

    userEvent.click(getByTestId("preview"));

    await waitFor(() => getByTestId("save"));

    const textarea = getByTestId("textarea");
    const save = getByTestId("save");

    const nextValue = "[new value]";

    fireEvent.change(textarea, { target: { value: nextValue } });
    fireEvent.click(save);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith(nextValue);
  });

  it("should show placeholder an empty value is submited", async () => {
    const defaultValue = "[Some random description]";
    const onSubmit = vi.fn();

    const { getByTestId } = render(<EditableMarkdown defaultValue={defaultValue} onSubmit={onSubmit} />);

    userEvent.click(getByTestId("preview"));

    await waitFor(() => getByTestId("save"));

    const textarea = getByTestId("textarea");
    const save = getByTestId("save");

    fireEvent.change(textarea, { target: { value: "" } });
    fireEvent.click(save);

    getByTestId("placeholder");
  });

  it("should revert changes on `cancel` button click", async () => {
    const defaultValue = "[Some random description]";
    const onSubmit = vi.fn();

    const { getByTestId } = render(<EditableMarkdown defaultValue={defaultValue} onSubmit={onSubmit} />);

    userEvent.click(getByTestId("preview"));

    await waitFor(() => getByTestId("save"));

    const textarea = getByTestId("textarea") as HTMLTextAreaElement;
    const cancel = getByTestId("cancel");

    const nextValue = "[new value]";

    fireEvent.change(textarea, { target: { value: nextValue } });
    fireEvent.click(cancel);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea.value).toBe(defaultValue);
  });

  it("renders preview as markdown");
});
