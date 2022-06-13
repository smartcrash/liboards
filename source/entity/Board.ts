import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Property, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column } from "./Column";
import { User } from "./User";

@ObjectType()
@Entity()
export class Board {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Property()
  title: string;

  @Field()
  @Property({ default: '' })
  description: string;

  @Property()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, user => user.boards)
  @TypeormLoader()
  user: User

  @Field(() => [Column])
  @ManyToOne(() => Column, column => column.board)
  @TypeormLoader()
  columns: Column[]

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @DeleteDateColumn()
  deletedAt: Date
}
