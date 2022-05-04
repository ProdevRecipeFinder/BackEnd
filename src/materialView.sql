-- Create Materialized view to reference appropriate tables and columns to search

CREATE MATERIALIZED VIEW search_index AS
SELECT
    recipe.id,
    recipe.recipe_title,
    recipe.recipe_desc,
    recipe.photo_url,
    recipe.rating_stars,
    recipe.review_count,
    setweight(to_tsvector('auto', recipe.recipe_title), 'B') || setweight(
        to_tsvector(
            'auto',
            coalesce(string_agg(ingredient.ingredient_name, ' '))
        ),
        'A'
    ) || setweight(to_tsvector('auto', recipe.recipe_desc), 'C') as document
FROM
recipe, ingredient, recipe_ingredients
WHERE
	recipe.id = recipe_ingredients.recipe_id
	AND
	ingredient.id = recipe_ingredients.ingredient_id
	GROUP BY recipe.id

-- Add search index column to table

CREATE INDEX idx_ft_search ON search_index USING gin(document);

-- Add function to re-calculate indicies on row changes to VIEW 

CREATE OR REPLACE FUNCTION refresh_search_idx()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
REFRESH MATERIALIZED VIEW search_index;
RETURN NULL;
END $$;

-- Add triggers to call index refresh on all tables related to MAT-VIEW

CREATE TRIGGER refresh_search_idx
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON recipe
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_search_idx();

  CREATE TRIGGER refresh_search_idx
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON recipe_ingredients
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_search_idx();

  CREATE TRIGGER refresh_search_idx
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON ingredient
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_search_idx();


-- CREATE A MIGRATION FROM THIS INFO AND RUN IT 
-- ONCE **AFTER** THE FINAL MIGRATION TO THE DB RAN
-- GENERATE MIGRATION, THEN CREATE EMPTY MIGRATION
-- AND USE THE FOLLOWING QUERIES:

await queryRunner.query(`DROP MATERIALIZED VIEW "public"."search_index" CASCADE;`);
await queryRunner.query(`DROP FUNCTION "public".refresh_search_idx() CASCADE;`);
await queryRunner.query(`CREATE MATERIALIZED VIEW search_index AS
SELECT
    recipe.id,
    recipe.recipe_title,
    recipe.recipe_desc,
    recipe.photo_url,
    recipe.rating_stars,
    recipe.review_count,
    setweight(to_tsvector('english', recipe.recipe_title), 'B') || setweight(
        to_tsvector(
            'english',
            coalesce(string_agg(ingredient.ingredient_name, ''))
        ),
        'A'
    ) || setweight(to_tsvector('english', recipe.recipe_desc), 'C') as document
FROM
recipe, ingredient, recipe_ingredients
WHERE
	recipe.id = recipe_ingredients.recipe_id
	AND
	ingredient.id = recipe_ingredients.ingredient_id
	GROUP BY recipe.id`);
        await queryRunner.query(`CREATE INDEX idx_ft_search ON search_index USING gin(document);`);
        await queryRunner.query(`CREATE OR REPLACE FUNCTION refresh_search_idx()
        RETURNS TRIGGER LANGUAGE plpgsql
        AS $$
        BEGIN
        REFRESH MATERIALIZED VIEW search_index;
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