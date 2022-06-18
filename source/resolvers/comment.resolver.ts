import { Resolver } from "type-graphql";
import { Comment } from "../entity";

@Resolver(Comment)
export class CommentResolver {
  async addComent() {
    throw new Error("Not Implemented");
  }

  async updateComment() {
    throw new Error("Not Implemented");
  }

  async removeCommnet() {
    throw new Error("Not Implemented");
  }
}
