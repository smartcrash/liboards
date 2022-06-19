import { type Request, type Response } from "express"
import { User } from "./entity"

export type ContextType = {
  req: Request & { session: Request['session'] & { userId?: number } }
  res: Response
  user?: User,
}

export interface Policy {
  /**
  * Determine whether the user can view any models.
  */
  viewAny(user: User): Promise<boolean> | boolean

  /**
   * Determine whether the user can view the model.
   */
  view(user: User, ...args: unknown[]): Promise<boolean> | boolean

  /**
   * Determine whether the user can create models.
   */
  create(user: User, ...args: unknown[]): Promise<boolean> | boolean

  /**
   * Determine whether the user can update the model.
   */
  update(user: User, ...args: unknown[]): Promise<boolean> | boolean

  /**
   * Determine whether the user can delete the model.
   */
  delete(user: User, ...args: unknown[]): Promise<boolean> | boolean

  /**
   * Determine whether the user can restore the model.
   */
  restore(user: User, ...args: unknown[]): Promise<boolean> | boolean

  /**
   * Determine whether the user can permanently delete the model.
   */
  forceDelete(user: User, ...args: unknown[]): Promise<boolean> | boolean
}
