import { MigrationInterface, QueryRunner } from "typeorm";

export class migration0061656686096618 implements MigrationInterface {
    name = 'migration0061656686096618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "UQ_ae7bfe48cb8fca88f4f99f13125" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "UQ_ae7bfe48cb8fca88f4f99f13125"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "slug"`);
    }

}
