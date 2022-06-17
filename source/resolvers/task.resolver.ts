import { Arg, FieldResolver, Int, Mutation, Resolver, Root } from "type-graphql";
import { Task } from "../entity";

@Resolver(Task)
export class TaskResolver {
  @FieldResolver()
  completed(@Root() root: Task): boolean {
    return !!root.completedAt
  }

  @Mutation(() => Task)
  async addTask(
    @Arg('description') description: string,
    @Arg('toCardId', () => Int) toCardId: number
  ): Promise<Task> {
    // TODO: Validate non-empty description
    return
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
