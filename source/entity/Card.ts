import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Property, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Column } from "./Column";

@ObjectType()
@Entity()
export class Card {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Property()
  title: string;

  @Field()
  @Property({ default: '' })
  content: string;

  @Field()
  @Property()
  index: number

  @Property()
  columnId: number

  @ManyToOne(() => Column, column => column.cards)
  @TypeormLoader()
  column: Column
}
