import { MigrationInterface, QueryRunner } from "typeorm";

export class migration0011655676598801 implements MigrationInterface {
    name = 'migration0011655676598801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "userId" integer NOT NULL, "cardId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "completedAt" datetime, "cardId" integer NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL DEFAULT (''), "index" integer NOT NULL, "columnId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "column" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "boardId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "favorite" ("userId" integer NOT NULL, "boardId" integer NOT NULL, PRIMARY KEY ("userId", "boardId"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "userId" integer NOT NULL, "cardId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_5dd31f454fdc52a2e336264b076" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "content", "userId", "cardId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "cardId", "createdAt", "updatedAt" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "completedAt" datetime, "cardId" integer NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_252627060053efe497200187c2a" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "content", "completedAt", "cardId", "createdById", "createdAt", "updatedAt") SELECT "id", "content", "completedAt", "cardId", "createdById", "createdAt", "updatedAt" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_card" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL DEFAULT (''), "index" integer NOT NULL, "columnId" integer NOT NULL, CONSTRAINT "FK_592a123bd8f9add5004b2aae1fb" FOREIGN KEY ("columnId") REFERENCES "column" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_card"("id", "title", "description", "index", "columnId") SELECT "id", "title", "description", "index", "columnId" FROM "card"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`ALTER TABLE "temporary_card" RENAME TO "card"`);
        await queryRunner.query(`CREATE TABLE "temporary_column" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "boardId" integer NOT NULL, CONSTRAINT "FK_cf15a522eb00160987b6fcf91e4" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_column"("id", "title", "boardId") SELECT "id", "title", "boardId" FROM "column"`);
        await queryRunner.query(`DROP TABLE "column"`);
        await queryRunner.query(`ALTER TABLE "temporary_column" RENAME TO "column"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite" ("userId" integer NOT NULL, "boardId" integer NOT NULL, CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_816af6da16147cd8632b6b2b2d9" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "boardId"))`);
        await queryRunner.query(`INSERT INTO "temporary_favorite"("userId", "boardId") SELECT "userId", "boardId" FROM "favorite"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite" RENAME TO "favorite"`);
        await queryRunner.query(`CREATE TABLE "temporary_board" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_d958e9af935f058823a58b09cb9" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_board"("id", "title", "createdById", "createdAt", "updatedAt", "deletedAt") SELECT "id", "title", "createdById", "createdAt", "updatedAt", "deletedAt" FROM "board"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`ALTER TABLE "temporary_board" RENAME TO "board"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" RENAME TO "temporary_board"`);
        await queryRunner.query(`CREATE TABLE "board" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`INSERT INTO "board"("id", "title", "createdById", "createdAt", "updatedAt", "deletedAt") SELECT "id", "title", "createdById", "createdAt", "updatedAt", "deletedAt" FROM "temporary_board"`);
        await queryRunner.query(`DROP TABLE "temporary_board"`);
        await queryRunner.query(`ALTER TABLE "favorite" RENAME TO "temporary_favorite"`);
        await queryRunner.query(`CREATE TABLE "favorite" ("userId" integer NOT NULL, "boardId" integer NOT NULL, PRIMARY KEY ("userId", "boardId"))`);
        await queryRunner.query(`INSERT INTO "favorite"("userId", "boardId") SELECT "userId", "boardId" FROM "temporary_favorite"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite"`);
        await queryRunner.query(`ALTER TABLE "column" RENAME TO "temporary_column"`);
        await queryRunner.query(`CREATE TABLE "column" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "boardId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "column"("id", "title", "boardId") SELECT "id", "title", "boardId" FROM "temporary_column"`);
        await queryRunner.query(`DROP TABLE "temporary_column"`);
        await queryRunner.query(`ALTER TABLE "card" RENAME TO "temporary_card"`);
        await queryRunner.query(`CREATE TABLE "card" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL DEFAULT (''), "index" integer NOT NULL, "columnId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "card"("id", "title", "description", "index", "columnId") SELECT "id", "title", "description", "index", "columnId" FROM "temporary_card"`);
        await queryRunner.query(`DROP TABLE "temporary_card"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "completedAt" datetime, "cardId" integer NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "task"("id", "content", "completedAt", "cardId", "createdById", "createdAt", "updatedAt") SELECT "id", "content", "completedAt", "cardId", "createdById", "createdAt", "updatedAt" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "userId" integer NOT NULL, "cardId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "comment"("id", "content", "userId", "cardId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "cardId", "createdAt", "updatedAt" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP TABLE "column"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
