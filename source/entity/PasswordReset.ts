import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PasswordReset {
  @PrimaryColumn()
  email: string

  @Column()
  token: string

  @CreateDateColumn()
  createdAt: Date
}
