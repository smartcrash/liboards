import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Property, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./Board";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class Column {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Property()
  title: string;

  // @Field()
  // @Property()
  // index: number

  @Property()
  boardId: number

  // @Field(() => Board)
  @ManyToOne(() => Board, board => board.columns)
  // @TypeormLoader()
  board: Board

  @Field(() => [Card])
  @OneToMany(() => Card, card => card.column)
  @TypeormLoader()
  cards: Card[]
}
