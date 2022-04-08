import {MigrationInterface, QueryRunner} from "typeorm";

export class m11649259906586 implements MigrationInterface {
    name = 'm11649259906586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" ALTER COLUMN "ingredient_unit" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" ALTER COLUMN "ingredient_unit" SET NOT NULL`);
    }

}
