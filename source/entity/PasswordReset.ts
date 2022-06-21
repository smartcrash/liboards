import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PasswordReset {
  @PrimaryColumn()
  email: string

  @Column()
  token: number

  @CreateDateColumn()
  createdAt: Date
}
