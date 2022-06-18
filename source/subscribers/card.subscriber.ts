import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { Card } from "../entity";

@EventSubscriber()
export class CardSubscriber implements EntitySubscriberInterface<Card> {
  listenTo = () => Card

  async beforeInsert({ entity, manager }: InsertEvent<Card>) {
    if (typeof entity.index !== 'number') {
      const repository = manager.getRepository(Card)
      const columnId = entity.column?.id || entity.columnId

      entity.index = await repository.countBy({ columnId })
    }
  }
}
