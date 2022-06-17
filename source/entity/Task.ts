import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { AfterLoad, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Card } from "./Card";
import { User } from "./User";

@ObjectType()
@Entity()
export class Taks {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  completedAt: Date

  @Column()
  cardId: number

  @Field(() => Card)
  @ManyToOne(() => Card, card => card.tasks, { onDelete: 'CASCADE' })
  @TypeormLoader()
  card: Card

  @Column()
  createdById: number

  @Field(() => User)
  @ManyToOne(() => User)
  @TypeormLoader()
  createdBy: User

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
