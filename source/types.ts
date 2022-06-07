import { type Request, type Response } from "express"
import { RedisClientType } from "redis"
import { type DataSource } from "typeorm"

export type TContext = {
  req: Request & { session: Request['session'] & { userId?: number } }
  res: Response
  dataSource: DataSource
  redisClient: RedisClientType
}
