import { faker } from '@faker-js/faker'
import { Task } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const TaskFactory = new EntityFactory(Task, () => {
  const task = new Task()
  task.content = faker.lorem.words(5)
  return task
})
