import { dataSource } from "../dataSource";
import { Card } from "../entity";

export const CardRepository = dataSource.getRepository(Card)
