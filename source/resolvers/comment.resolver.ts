import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Comment } from "../entity";
import { AllowIf, Authenticate } from "../middlewares";
import { commentRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Comment)
export class CommentResolver {
  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-comment'))
  @Mutation(() => Comment)
  async addComment(
    @Arg('content') content: string,
    @Arg('cardId', () => Int) cardId: number,
    @Ctx() { user }: ContextType
  ): Promise<Comment | null> {
    if (!content.length) return null

    const comment = new Comment()
    comment.content = content
    comment.userId = user.id
    comment.cardId = cardId
    await commentRepository.save(comment)

    return comment
  }

  @Mutation(() => Comment)
  async updateComment(
    @Arg('id', () => Int) id: number,
    @Arg('content') content: string,
  ) {
    throw new Error("Not Implemented");
  }

  @Mutation(() => Int)
  async removeComment(@Arg('id', () => Int) id: number): Promise<number> {
    return id
  }
}
