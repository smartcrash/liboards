import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Task } from '../entity'

define(Task, () => {
  const task = new Task()
  task.description = faker.lorem.words(5)
  return task
})

export const taskFactory = () => factory(Task)()
