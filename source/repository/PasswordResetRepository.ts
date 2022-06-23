import { dataSource } from "../dataSource";
import { PasswordReset } from "../entity";

export const PasswordResetRepository = dataSource.getRepository(PasswordReset)
