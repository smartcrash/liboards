import { dataSource } from "../dataSource";
import { Card } from "../entity";

export const cardRepository = dataSource.getRepository(Card)
