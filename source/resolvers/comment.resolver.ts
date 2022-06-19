import { Arg, Ctx, FieldResolver, Int, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Comment } from "../entity";
import { AllowIf, Authenticate } from "../middlewares";
import { CommentPolicy } from "../policies";
import { commentRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => Boolean)
  canUpdate(
    @Root() root: Comment,
    @Ctx() { user }: ContextType
  ): boolean {
    return new CommentPolicy().update(user, root)
  }

  @FieldResolver(() => Boolean)
  canDelete(
    @Root() root: Comment,
    @Ctx() { user }: ContextType
  ): boolean {
    return new CommentPolicy().delete(user, root)
  }

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

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-comment'))
  @Mutation(() => Comment)
  async updateComment(
    @Arg('id', () => Int) id: number,
    @Arg('content', { nullable: true }) content: string | null,
  ): Promise<Comment> {
    const comment = await commentRepository.findOneBy({ id })
    comment.content = content ?? comment.content
    await commentRepository.save(comment)

    return comment
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-comment'))
  @Mutation(() => Int)
  async removeComment(@Arg('id', () => Int) id: number): Promise<number> {
    await commentRepository.delete({ id })

    return id
  }
}
