import {MigrationInterface, QueryRunner} from "typeorm";

export class m11649259851945 implements MigrationInterface {
    name = 'm11649259851945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_saved_recipes" ("user_id" integer NOT NULL, "recipe_id" integer NOT NULL, CONSTRAINT "PK_945cc61f1a5f6314aeb88f412d4" PRIMARY KEY ("user_id", "recipe_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "user_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d34106f8ec1ebaf66f4f8609dd6" UNIQUE ("user_name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_authors" ("recipe_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_be7e11d574a2069ebcf2fb62530" PRIMARY KEY ("recipe_id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" SERIAL NOT NULL, "ingredient_name" character varying NOT NULL, "ingredient_unit" character varying NOT NULL, "ingredient_qty" character varying, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredients" ("recipe_id" integer NOT NULL, "ingredient_id" integer NOT NULL, CONSTRAINT "PK_90484480b3b2978068565ae2a2f" PRIMARY KEY ("recipe_id", "ingredient_id"))`);
        await queryRunner.query(`CREATE TABLE "step" ("id" SERIAL NOT NULL, "step_desc" character varying, CONSTRAINT "PK_70d386ace569c3d265e05db0cc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_steps" ("recipe_id" integer NOT NULL, "step_id" integer NOT NULL, CONSTRAINT "PK_ec17a5acb0989b07103f74c8a13" PRIMARY KEY ("recipe_id", "step_id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "recipe_title" character varying NOT NULL, "external_author" character varying, "recipe_desc" character varying NOT NULL, "prep_time_minutes" integer NOT NULL, "cook_time_minutes" integer NOT NULL, "total_time_minutes" integer NOT NULL, "footnotes" text array, "original_url" character varying, "photo_url" character varying, "rating_stars" character varying, "review_count" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_tags" ("recipe_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_01345664192b9ae436dfb055aa3" PRIMARY KEY ("recipe_id", "tag_id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "tag_name" character varying NOT NULL, "tag_desc" character varying, CONSTRAINT "UQ_c567d5f21442789d3fb85a53f07" UNIQUE ("tag_name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_saved_recipes" ADD CONSTRAINT "FK_09c1a552e056d905067fd22712f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_saved_recipes" ADD CONSTRAINT "FK_e17133ceae835778cd1896425bd" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_authors" ADD CONSTRAINT "FK_530dedf1543374d733c1ce8f524" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_authors" ADD CONSTRAINT "FK_53934d791a27a54d7ae46f33f1c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_f240137e0e13bed80bdf64fed53" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_133545365243061dc2c55dc1373" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" ADD CONSTRAINT "FK_38ada029d0ae403b4d552c88527" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" ADD CONSTRAINT "FK_1f0a88154da91c0e33194bafd34" FOREIGN KEY ("step_id") REFERENCES "step"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_tags" ADD CONSTRAINT "FK_debe611aa6b0e4876f0c6ec77a9" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_tags" ADD CONSTRAINT "FK_03a9973d20215e31676a3d90937" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_tags" DROP CONSTRAINT "FK_03a9973d20215e31676a3d90937"`);
        await queryRunner.query(`ALTER TABLE "recipe_tags" DROP CONSTRAINT "FK_debe611aa6b0e4876f0c6ec77a9"`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" DROP CONSTRAINT "FK_1f0a88154da91c0e33194bafd34"`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" DROP CONSTRAINT "FK_38ada029d0ae403b4d552c88527"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_133545365243061dc2c55dc1373"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_f240137e0e13bed80bdf64fed53"`);
        await queryRunner.query(`ALTER TABLE "recipe_authors" DROP CONSTRAINT "FK_53934d791a27a54d7ae46f33f1c"`);
        await queryRunner.query(`ALTER TABLE "recipe_authors" DROP CONSTRAINT "FK_530dedf1543374d733c1ce8f524"`);
        await queryRunner.query(`ALTER TABLE "user_saved_recipes" DROP CONSTRAINT "FK_e17133ceae835778cd1896425bd"`);
        await queryRunner.query(`ALTER TABLE "user_saved_recipes" DROP CONSTRAINT "FK_09c1a552e056d905067fd22712f"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "recipe_tags"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "recipe_steps"`);
        await queryRunner.query(`DROP TABLE "step"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredients"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "recipe_authors"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_saved_recipes"`);
    }

}
