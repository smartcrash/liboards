import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PasswordReset {
  @PrimaryColumn()
  email: string

  @Column()
  token: string

  @CreateDateColumn()
  createdAt: Date

  get expired(): boolean {
    const now = new Date()
    const diffInMs = now.valueOf() - this.createdAt.valueOf()
    const diffInHours = diffInMs / 1000 / 60 / 60

    return diffInHours > 1
  }
}
