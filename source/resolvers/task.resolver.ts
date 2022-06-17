import { Arg, Ctx, FieldResolver, Int, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Task } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { taskRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Task)
export class TaskResolver {
  @FieldResolver()
  completed(@Root() root: Task): boolean {
    return !!root.completedAt
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-task'))
  @Mutation(() => Task, { nullable: true })
  async addTask(
    @Arg('description') description: string,
    @Arg('cardId', () => Int) cardId: number,
    @Ctx() { user }: ContextType
  ): Promise<Task | null> {
    if (!description.length) return null

    const task = new Task()
    task.description = description
    task.cardId = cardId
    task.createdById = user.id
    await taskRepository.save(task)

    return task
  }

  @Mutation(() => Task)
  async updateTask(
    @Arg('id', () => Int) id: number,
    @Arg('description', () => String, { nullable: true }) description: string | null,
    @Arg('complete', () => Boolean, { nullable: true }) complete: boolean | null,
  ): Promise<Task> {
    return
  }

  @Mutation(() => Boolean)
  async removeTask(@Arg('id', () => Int) id: number) { }
}
