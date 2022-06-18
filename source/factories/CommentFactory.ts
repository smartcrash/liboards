
import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Comment } from '../entity'

define(Comment, () => {
  const comment = new Comment()
  comment.content = faker.lorem.sentence()
  return comment
})

export const CommentFactory = factory(Comment)()
