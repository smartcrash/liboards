import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column as Property, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column } from "./Column";
import { Favorite } from "./Favorite";
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
  @Property({ unique: true })
  slug: string;

  @Property()
  createdById: number

  // TODO: Handle what should happen when a user is deleted
  @Field(() => User)
  @ManyToOne(() => User, user => user.boards)
  @TypeormLoader()
  createdBy: User

  @Field(() => [Column])
  @OneToMany(() => Column, column => column.board)
  @TypeormLoader()
  columns: Column[]

  @OneToMany(() => Favorite, favorite => favorite.board)
  favorites!: Favorite[];

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
