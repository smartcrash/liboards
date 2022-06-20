import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Board, User } from "./";

@Entity()
export class Favorite {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  boardId: number

  @ManyToOne(() => User, (user) => user.favorites)
  user: User

  @ManyToOne(() => Board, (board) => board.favorites)
  board: Board
}
