import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { Recipe } from "../entities/Recipe";
import { throwAuthError } from "../middleware/checkAuth";
import { ServerContext } from "../types";
import { PaginatedRecipe } from "./helpers/_@_ObjectTypes";

@Resolver(Recipe)
export class RecipeResolver {


  // **** NO PERMISSIONS **** //
  @Query(() => [Recipe], { nullable: true })
  async getAllRecipes() {
    return await Recipe.find();
  }

  //Returns one recipe
  @Query(() => Recipe, { nullable: true })
  async getOneRecipe(
    @Arg("id") id: number
  ) {
    const recipe = await Recipe.findOne(id);
    return recipe;
  }

  @Query(() => [Recipe])
  async getMostPopular(
    @Arg("limit", { nullable: true }) limit: number
  ): Promise<Recipe[]> {

    const replacements: string[] = [];

    let fetchLimit = 20;

    if (limit) {
      fetchLimit = Math.min(50, limit);
    }

    const adjustedfetchLimit = fetchLimit + 1;

    replacements.push(adjustedfetchLimit.toString());

    const getMostPopularSQL = `
    SELECT "recipe"."id" as "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
    FROM "recipe"
    INNER JOIN "user_saved_recipes" ON "recipe"."id" = "user_saved_recipes"."recipe_id"
    GROUP BY "recipe"."id"
    ORDER BY COUNT("recipe"."id") DESC
    LIMIT $1;
    `

    const foundMostPopular: Recipe[] = await getManager().query(getMostPopularSQL, replacements);

    return foundMostPopular;
  }

  @Query(() => PaginatedRecipe)
  async getHomePage(
    @Arg("limit", { nullable: true }) limit: number
  ): Promise<PaginatedRecipe> {

    let fetchLimit = 20;
    if (limit) {
      fetchLimit = Math.min(50, limit);
    }
    const adjustedFetchLimit = fetchLimit + 1;

    const replacements: string[] = [];

    replacements.push(adjustedFetchLimit.toString());

    const getHomepageSQL = `
    SELECT "recipe"."id" as "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
    FROM "recipe"
    ORDER BY RANDOM()
    LIMIT $1;
    `

    const fetchedHomepageResults = await getManager().query(getHomepageSQL, replacements);

    return {
      recipes: fetchedHomepageResults.slice(0, fetchLimit),
      pageInfo: {
        endCursor: fetchedHomepageResults.length === adjustedFetchLimit ? fetchedHomepageResults[fetchedHomepageResults.length - 2].id : fetchedHomepageResults[fetchedHomepageResults.length - 1].id,
        hasNextPage: fetchedHomepageResults.length === adjustedFetchLimit
      }
    }
  }


  // **** REQUIRES PERMISSIONS **** //

  //Returns all recipes for user
  @Query(() => PaginatedRecipe, { nullable: true })
  async getSavedRecipes(
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("cursor", { nullable: true }) cursor: number,
    @Ctx() { req }: ServerContext
  ) {
    const user_id = req.session!.userId

    // throw error on endpoint if user is not authenticated
    if (!user_id) {
      throwAuthError();
      return
    }

    let fetchLimit = 20;
    if (limit) {
      fetchLimit = Math.min(50, limit);
    }
    const adjustedFetchLimit = fetchLimit + 1;

    const replacements: string[] = [];

    replacements.push(user_id);
    replacements.push(adjustedFetchLimit.toString());

    if (cursor) {
      replacements.push(cursor.toString());
    }

    const recipesQuerySql = `
        SELECT "recipe"."id" AS "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
        FROM "recipe"
        INNER JOIN "user_saved_recipes" ON "recipe"."id" = "user_saved_recipes"."recipe_id"
        INNER JOIN "user" ON "user_saved_recipes"."user_id" = "user"."id"
        WHERE "user"."id" = $1 ${cursor ? `AND "recipe"."id" < $3` : ""}
        ORDER BY "recipe_id" DESC
        limit $2;`

    const foundRecipes = await getManager().query(recipesQuerySql, replacements);

    // return is in shape of PaginatedRecipe type
    return {
      recipes: foundRecipes.slice(0, fetchLimit),
      pageInfo: {
        endCursor: foundRecipes.length === adjustedFetchLimit ? foundRecipes[foundRecipes.length - 2].id : foundRecipes[foundRecipes.length - 1].id,
        hasNextPage: foundRecipes.length === adjustedFetchLimit
      }
    };
  }


  @Mutation(() => Boolean)
  async saveRecipeToUser(
    @Arg("recipe_id") recipe_id: number,
    @Ctx() { req }: ServerContext
  ) {
    const user_id: number = parseInt(req.session.userId);

    // throw error on endpoint if user is not authenticated
    if (!user_id) {
      throwAuthError();
      return
    }

    await UserSavedRecipes.create({ user_id, recipe_id }).save();
    return true;
  }

  //Delete Saved Recipe
  @Mutation(() => Boolean)
  async deleteSavedRecipe(
    @Arg("recipe_id") recipe_id: number,
    @Ctx() { req }: ServerContext
  ): Promise<Boolean> {
    const user_id: number = parseInt(req.session.userId);

    // throw error on endpoint if user is not authenticated
    if (!user_id) {
      throwAuthError();
      return false;
    }

    await UserSavedRecipes.delete({ user_id: user_id, recipe_id: recipe_id });
    return true;
  }

  // **** NOT USED **** // 


  //Update Existing Recipe
  // @Mutation(() => Recipe)
  // async updateRecipe(
  //   @Arg("id") id: number,
  //   @Arg("input") recipe_input: RecipeInput
  // ): Promise<Recipe | undefined> {
  //   const recipe = await Recipe.findOne(id);
  //   if (!recipe) {
  //     return undefined;
  //   }
  //   Object.assign(recipe, recipe_input);
  //   await recipe.save();
  //   return recipe;
  // }

  //Delete Owned Recipe
  // @Mutation(() => Recipe)
  // async deleteOwnedRecipe(
  //   @Arg("id") id: number
  // ): Promise<Boolean> {
  //   await UserSavedRecipes.delete(id);
  //   await Recipe.delete(id);
  //   return true;
  // }

  //Add New Recipe
  // @Mutation(() => Recipe)
  // async addNewRecipe(
  //   @Arg("input") input: RecipeInput,
  //   @Ctx() { req }: ServerContext
  // ) {

  //     ...input,
  //   const newRecipe = await Recipe.create({
  //   }).save();

  //   const author: number = parseInt(req.session.userId);


  //   await RecipeAdder(newRecipe, input.ingredients, input.steps, input.tags, author);

  //   return Recipe.findOne({
  //     where: {
  //       id: newRecipe.id
  //     }
  //   })
  // }


}