
import { MiddlewareFn } from "type-graphql";
import { dataSource } from "../dataSource";
import { BoardPolicy, CardPolicy, ColumnPolicy, CommentPolicy, TaskPolicy } from "../policies";
import { ContextType } from '../types';

const policies = {
  'board': BoardPolicy,
  'column': ColumnPolicy,
  'card': CardPolicy,
  'task': TaskPolicy,
  'comment': CommentPolicy,
} as const

// TODO: Separate gateKey into to arguments for type safety
export const AllowIf = (gateKey: string): MiddlewareFn<ContextType> => {
  return async (action, next) => {
    const [methodKey, entityName] = gateKey.split('-')
    const policy = new policies[entityName]()
    const repository = dataSource.getRepository(entityName)
    let entity: unknown = null

    if (methodKey === 'viewAny') {
      // Do nothing, `entity` remains as `null`
    }
    // If is creating create a partial entity from the `args`
    // We asume by convention that the `args` are the creation
    // parameters.
    else if (methodKey === 'create') {
      entity = repository.create(action.args)
    }
    // If is not creating that means that the entity exists on database.
    // Then we try to get it assuing that it's ID is on the `args`
    else {
      entity = await repository.findOne({
        where: { id: action.args.id },
        withDeleted: true, // Must add deleted ones for the `restore` method to works
      })
    }

    const handler = policy[methodKey]
    let allowed = false

    try {
      allowed = await handler(action.context.user, entity)
    } catch (error) {
      // If the handler throws that means that one `findByOrFail` failed
      // because the entity was not faund. In that case we shouldn't allow
      // the user to do anything either.
    }

    if (!allowed) throw new Error("Forbidden");

    return next()
  }
}

