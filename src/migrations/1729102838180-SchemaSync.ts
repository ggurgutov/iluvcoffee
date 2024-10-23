import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1729102838180 implements MigrationInterface {
    name = 'SchemaSync1729102838180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coffee" ADD "recommendations" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "coffee" ALTER COLUMN "brand" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ALTER COLUMN "brand" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "recommendations"`);
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
    }

}
