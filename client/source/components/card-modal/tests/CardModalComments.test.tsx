import { faker } from "@faker-js/faker";
import { format, subDays } from "date-fns";
import { times } from "lodash";
import { describe, expect, it } from "vitest";
import { fireEvent, userEvent, waitFor, within } from "../../../utils/testUtils";
import { CardModalCommnents } from "../src/CardModalCommnents";
import { createRadomComment, createRandomCard, customRender } from "../testUtils";

describe("<CardModalComments />", () => {
  it("renders", () => {
    customRender(<CardModalCommnents />);
  });

  it("shows a list containing all card's comments", () => {
    const comments = times(3, () => createRadomComment());

    const { getByTestId } = customRender(<CardModalCommnents />, createRandomCard({ comments }));

    const list = within(getByTestId("comment-list"));

    expect(list.getAllByRole("listitem")).toHaveLength(comments.length);

    comments.forEach(({ id, content, user: { userName }, createdAt }) => {
      const container = within(list.getByTestId(`comment-item:${id}`));

      expect(container.getAllByText(content).length).toBeTruthy();
      expect(container.getByText(userName)).toBeTruthy();
      expect(container.getByText(format(createdAt, "MMM d p"))).toBeTruthy();
    });
  });

  it("order comments by descending creation date", async () => {
    const comments = [
      createRadomComment({ createdAt: subDays(new Date(), 1) }),
      createRadomComment({ createdAt: new Date() }),
    ];

    const { getByTestId } = customRender(<CardModalCommnents />, createRandomCard({ comments }));

    const [oldestComment, newestComment] = comments;
    const list = within(getByTestId("comment-list"));
    const items = list.getAllByRole("listitem");

    expect(items[0].innerHTML).toContain(newestComment.content);
    expect(items[1].innerHTML).toContain(oldestComment.content);
  });

  it("add a new comment", async () => {
    const content = faker.lorem.words();
    const { getByTestId, addComment, card } = customRender(<CardModalCommnents />, createRandomCard({ comments: [] }));

    expect(addComment).not.toHaveBeenCalled();

    const form = within(getByTestId("comment-form"));
    const input = form.getByRole("textbox");
    const button = form.getByRole("button");

    await userEvent.type(input, content);
    await userEvent.click(button);

    expect(addComment).toHaveBeenCalledWith({ cardId: card.id, content });
  });

  it("update existing comment", async () => {
    const comment = createRadomComment();

    const { getByTestId, updateComment } = customRender(
      <CardModalCommnents />,
      createRandomCard({ comments: [comment] })
    );

    const nextValue = faker.lorem.words();
    const container = within(getByTestId(`comment-item:${comment.id}`));
    const edit = container.getByTestId("edit-comment");

    await userEvent.click(edit);

    const form = container.getByTestId("edit-comment-form");
    const input = within(form).getByDisplayValue(comment.content);

    await userEvent.clear(input);
    await userEvent.type(input, `${nextValue}`);

    fireEvent.submit(form);

    await waitFor(() =>
      expect(updateComment).toHaveBeenCalledWith({
        id: comment.id,
        content: nextValue,
      })
    );
  });

  it("remove comment", async () => {
    const comment = createRadomComment();

    const { getByTestId, removeComment } = customRender(
      <CardModalCommnents />,
      createRandomCard({ comments: [comment] })
    );

    const container = within(getByTestId(`comment-item:${comment.id}`));
    const remove = container.getByTestId("delete-comment");

    await userEvent.click(remove);

    await waitFor(() => expect(removeComment).toHaveBeenCalledWith({ id: comment.id }));
  });

  it("should not show remove button if `canDelete` = false", async () => {
    const comment = createRadomComment({ canDelete: false });

    const { getByTestId } = customRender(<CardModalCommnents />, createRandomCard({ comments: [comment] }));

    const container = within(getByTestId(`comment-item:${comment.id}`));
    const button = container.queryByTestId("delete-comment");

    expect(button).toBeFalsy();
  });

  it("should not show edit button if `canUpdate` = false", () => {
    const comment = createRadomComment({ canUpdate: false });

    const { getByTestId } = customRender(<CardModalCommnents />, createRandomCard({ comments: [comment] }));

    const container = within(getByTestId(`comment-item:${comment.id}`));
    const button = container.queryByTestId("edit-comment");

    expect(button).toBeFalsy();
  });
});
