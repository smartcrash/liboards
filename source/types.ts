import { type Request, type Response } from "express"
import { User } from "./entity"

export type ContextType = {
  req: Request & { session: Request['session'] & { userId?: number } }
  res: Response
  user?: User,
}
