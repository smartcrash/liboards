import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Propertie, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Column } from "./Column";

@ObjectType()
@Entity()
export class Card {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Propertie()
  title: string;

  @Field()
  @Propertie({ default: '' })
  content: string;

  @Field()
  @Propertie()
  index: number

  @Propertie()
  columnId: number

  @ManyToOne(() => Column, column => column.cards)
  @TypeormLoader()
  column: Column
}
