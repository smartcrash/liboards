import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Property, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { Column } from "./Column";
import { Taks } from "./Task";

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
  description: string;

  @Field()
  @Property()
  index: number

  @Property()
  columnId: number

  @Field(() => Column)
  @ManyToOne(() => Column, column => column.cards, { onDelete: 'CASCADE' })
  @TypeormLoader()
  column: Column

  @Field(() => [Taks])
  @OneToMany(() => Taks, taks => taks.card)
  @TypeormLoader()
  tasks: Card[]
}
