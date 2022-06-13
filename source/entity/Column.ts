import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Propertie, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class Column {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Propertie()
  title: string;

  @Field()
  @Propertie()
  index: number

  @Propertie()
  boardId: number

  @Field(() => [Card])
  @OneToMany(() => Card, card => card.column)
  @TypeormLoader()
  cards: Card[]
}
