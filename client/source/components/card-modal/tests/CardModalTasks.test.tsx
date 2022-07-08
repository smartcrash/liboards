import { faker } from "@faker-js/faker";
import { times } from "lodash";
import { describe, expect, it } from "vitest";
import { CardModalTasks } from "../src/CardModalTasks";
import { createMockCard, customRender } from "../testUtils";
import { fireEvent, userEvent, within, waitFor, waitForElementToBeRemoved } from "../../../utils/testUtils";

describe("<CardModalTasks />", () => {
  it("renders", () => {
    customRender(<CardModalTasks />);
  });

  it("shows a list containing all card's tasks", () => {
    const tasks = times(3, () => ({
      id: faker.datatype.number(),
      content: faker.lorem.words(),
      completed: faker.datatype.boolean(),
    }));

    const { getByTestId } = customRender(<CardModalTasks />, createMockCard({ tasks }));

    const list = within(getByTestId("task-list"));

    expect(list.getAllByRole("listitem")).toHaveLength(tasks.length);

    tasks.forEach(({ id, content, completed }) => {
      const container = within(list.getByTestId(`task-item:${id}`));

      expect(container.getAllByText(content).length).toBeTruthy();
      expect(container.getByDisplayValue(content)).toBeTruthy();
      expect((container.getByRole("checkbox") as HTMLInputElement).checked).toBe(completed);
    });
  });

  it("order tasks by descending creation date");

  it("can toggle show completed tasks", () => {
    const [completed, notCompleted] = [
      {
        id: faker.datatype.number(),
        content: faker.lorem.words(),
        completed: true,
      },
      {
        id: faker.datatype.number(),
        content: faker.lorem.words(),
        completed: false,
      },
    ];

    const { getByTestId } = customRender(<CardModalTasks />, createMockCard({ tasks: [completed, notCompleted] }));

    const list = within(getByTestId("task-list"));

    // Should show all by default
    expect(list.getAllByRole("listitem")).toHaveLength(2);

    fireEvent.click(getByTestId("toggle-show-completed"));

    // Now the completed task should not exist
    expect(list.getAllByRole("listitem")).toHaveLength(1);
    expect(list.queryByText(completed.content)).toBeFalsy();
  });

  it("add a new task", async () => {
    const content = faker.lorem.words();
    const { getByTestId, addTask, card } = customRender(<CardModalTasks />, createMockCard({ tasks: [] }));

    expect(addTask).not.toHaveBeenCalled();

    fireEvent.click(getByTestId("add-task"));

    const input = within(getByTestId("task-form")).getByRole("textbox");

    userEvent.type(input, `${content}{enter}`);

    await waitFor(() => expect(addTask).toHaveBeenCalledWith({ cardId: card.id, content }));
  });

  it("can mark a task as completed", async () => {
    const task = {
      id: faker.datatype.number(),
      content: faker.lorem.words(),
      completed: false,
    };

    const { getByTestId, updateTask } = customRender(<CardModalTasks />, createMockCard({ tasks: [task] }));

    const container = within(getByTestId(`task-item:${task.id}`));
    const checkbox = container.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => expect(updateTask).toHaveBeenCalledWith({ ...task, completed: true }));
  });

  it("update existing task", async () => {
    const task = {
      id: faker.datatype.number(),
      content: faker.lorem.words(),
      completed: false,
    };

    const { getByTestId, updateTask } = customRender(<CardModalTasks />, createMockCard({ tasks: [task] }));

    const nextValue = faker.lorem.words();
    const container = within(getByTestId(`task-item:${task.id}`));
    const input = container.getByDisplayValue(task.content);

    userEvent.clear(input);
    userEvent.type(input, `${nextValue}{enter}`);

    await waitFor(() =>
      expect(updateTask).toHaveBeenCalledWith({
        id: task.id,
        content: nextValue,
        completed: false,
      })
    );
  });

  it("remove task", async () => {
    const task = {
      id: faker.datatype.number(),
      content: faker.lorem.words(),
      completed: false,
    };

    const { getByTestId, removeTask } = customRender(<CardModalTasks />, createMockCard({ tasks: [task] }));

    const container = within(getByTestId(`task-item:${task.id}`));
    const button = container.getByTestId("remove-task");

    fireEvent.click(button);

    await waitFor(() => expect(removeTask).toHaveBeenCalledWith({ id: task.id }));
  });
});
