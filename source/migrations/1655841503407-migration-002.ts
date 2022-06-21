import { MigrationInterface, QueryRunner } from "typeorm";

export class migration0021655841503407 implements MigrationInterface {
  name = 'migration0021655841503407'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "password_reset" ("email" character varying NOT NULL, "token" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c88db6e50f0704688d1f1978c0" PRIMARY KEY ("email"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "password_reset"`);
  }

}
