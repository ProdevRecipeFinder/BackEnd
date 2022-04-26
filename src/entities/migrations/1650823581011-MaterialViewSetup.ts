import { MigrationInterface, QueryRunner } from "typeorm";

export class MaterialViewSetup1650823581011 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE MATERIALIZED VIEW search_index AS
SELECT recipe.id,
        recipe.recipe_title,
        recipe.recipe_desc,
        recipe.photo_url,
        recipe.rating_stars,
        recipe.review_count,
        setweight(to_tsvector('english', recipe.recipe_title), 'A') 
        || 
        setweight(to_tsvector('english', recipe.recipe_desc), 'C') 
        || 
        setweight(to_tsvector('english', coalesce(string_agg(ingredient.ingredient_name, ''))), 'B') as document
FROM recipe
JOIN recipe_ingredients ON recipe_ingredients.recipe_id = recipe_ingredients.ingredient_id
JOIN ingredient ON ingredient.id = recipe_ingredients.ingredient_id
GROUP BY recipe.id;`);
    await queryRunner.query(`CREATE INDEX idx_ft_search ON search_index USING gin(document);`);
    await queryRunner.query(`CREATE OR REPLACE FUNCTION refresh_search_idx()
        RETURNS TRIGGER LANGUAGE plpgsql
        AS $$
        BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY search_index;
        RETURN NULL;
        END $$;`);
    await queryRunner.query(`CREATE TRIGGER refresh_search_idx
        AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
        ON recipe
        FOR EACH STATEMENT
        EXECUTE PROCEDURE refresh_search_idx();`);
    await queryRunner.query(`CREATE TRIGGER refresh_search_idx
        AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
        ON recipe_ingredients
        FOR EACH STATEMENT
        EXECUTE PROCEDURE refresh_search_idx();`);
    await queryRunner.query(`CREATE TRIGGER refresh_search_idx
        AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
        ON ingredient
        FOR EACH STATEMENT
        EXECUTE PROCEDURE refresh_search_idx();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
