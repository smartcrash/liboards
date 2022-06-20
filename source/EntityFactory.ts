import { ObjectType, Repository } from 'typeorm'
import { dataSource } from './dataSource'


/**
 * FactoryFunction is the fucntion, which generate a new filled entity
 */
type FactoryFunction<Entity> = () => Entity

/**
 * EntityProperty defines an object whose keys and values must be properties of the given Entity.
 */
type EntityProperty<Entity> = { [Property in keyof Entity]?: Entity[Property] }

export class EntityFactory<Entity> {
  private mapFunction: (entity: Entity) => Promise<Entity>
  private repository: Repository<Entity>

  constructor(
    public entity: ObjectType<Entity>,
    private factoryFn: FactoryFunction<Entity>,
  ) {
    this.repository = dataSource.getRepository(entity)
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * This function is used to alter the generated values of entity, before it
   * is persist into the database
   */
  public map(mapFunction: (entity: Entity) => Promise<Entity>): EntityFactory<Entity> {
    this.mapFunction = mapFunction
    return this
  }

  /**
   * Make a new entity, but does not persist it
   */
  public async make(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    return this.makeEnity(overrideParams)
  }

  /**
   * Create makes a new entity and does persist it
   */
  public async create(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    try {
      const entity = await this.makeEnity(overrideParams)
      return await this.repository.save(entity)
    } catch (error) {
      throw new Error('Could not save entity')
    }
  }

  public async makeMany(amount: number, overrideParams: EntityProperty<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  public async createMany(
    amount: number,
    overrideParams: EntityProperty<Entity> = {},
  ): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams)
    }
    return list
  }

  // -------------------------------------------------------------------------
  // Private Helpers
  // -------------------------------------------------------------------------

  private async makeEnity(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    if (!this.factoryFn) {
      throw new Error('Could not found entity')
    }

    let entity = this.repository.create(this.factoryFn())

    if (this.mapFunction) {
      entity = await this.mapFunction(entity)
    }

    for (const key in overrideParams) {
      if (overrideParams.hasOwnProperty(key)) {
        entity[key] = overrideParams[key]
      }
    }

    return entity
  }
}
