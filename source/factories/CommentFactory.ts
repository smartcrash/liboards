
import { faker } from '@faker-js/faker'
import { Comment } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const CommentFactory = new EntityFactory(Comment, () => {
  const comment = new Comment()
  comment.content = faker.lorem.sentence()
  return comment
})
