import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Card } from "./Card";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Column()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  @TypeormLoader()
  user: User

  @Column()
  cardId: number

  @Field(() => Card)
  @ManyToOne(() => Card, card => card.comments, { onDelete: 'CASCADE' })
  @TypeormLoader()
  card: Card

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
