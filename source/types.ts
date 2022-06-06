import { type Request, type Response } from "express"
import { type DataSource } from "typeorm"

export type TContext = {
  req: Request & { session: Request['session'] & { userId?: number } }
  res: Response
  dataSource: DataSource
}
