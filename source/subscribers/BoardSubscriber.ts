import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { Board } from "../entity";
import slug from "../utils/slug";

@EventSubscriber()
export class BoardSubscriber implements EntitySubscriberInterface<Board> {
  listenTo = () => Board

  async afterInsert({ entity, manager }: InsertEvent<Board>) {
    const repository = manager.getRepository(Board)
    await repository.update({ id: entity.id }, { slug: slug(entity.title, entity.id) })
  }

  async beforeUpdate({ entity }: UpdateEvent<Board>) {
    if (entity.title) {
      entity.slug = slug(entity.title, entity.id)
    }
  }
}
