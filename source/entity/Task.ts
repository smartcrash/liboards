import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Card } from "./Card";
import { User } from "./User";

@ObjectType()
@Entity()
export class Task {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  description: string;

  @Column({ nullable: true })
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
