import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { IMAGE_UPLOAD_PREFIX } from "../constants";
import { RecipeAuthors } from "../entities/joinTables/RecipeAuthor";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { Recipe } from "../entities/Recipe";
import { VoteStatus } from "../entities/VoteStatus";
import { throwAuthError } from "../middleware/checkAuth";
import { ServerContext } from "../types";
import { RecipeAdder } from "./helpers/recipeAdder";
import { RecipeDeleter } from "./helpers/recipeDeleter";
import { RecipeUpdater } from "./helpers/recipeUpdater";
import { DeleteRequest, PaginatedRecipe } from "./helpers/_@_ObjectTypes";
import { RecipeInput, VoteParams } from "./ResTypes";

@Resolver(Recipe)
export class RecipeResolver {

  // **** NO PERMISSIONS **** //
  @Query(() => [Recipe], { nullable: true })
  async getAllRecipes() {
    return await Recipe.find();
  }

  @Query(() => Number)
  async getVoteStatus(
    @Arg("recipe_id") recipe_id: number,
    @Ctx() { req }: ServerContext
  ): Promise<Number | Error> {
    const userId = parseInt(req.session.userId)
    if (!userId) {
      return throwAuthError();
    }
    const foundVote = await VoteStatus.findOne({
      where: {
        recipe_id: recipe_id,
        user_id: userId
      }
    });

    if (!foundVote) {
      return -1;
    }
    console.log(foundVote);

    return foundVote.rating_stars
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
  ): Promise<Boolean | DeleteRequest | Error> {
    const user_id: number = parseInt(req.session.userId);

    // throw error on endpoint if user is not authenticated
    if (!user_id) {
      return throwAuthError();
    }

    await UserSavedRecipes.delete({ user_id: user_id, recipe_id: recipe_id });
    return true;
  };

  @Mutation(() => Boolean)
  async voteOnRecipe(
    @Arg("vote_params") voteParams: VoteParams,
    @Ctx() { req }: ServerContext
  ): Promise<Boolean | Error> {
    const user_id: number = parseInt(req.session.userId);
    // throw error on endpoint if user is not authenticated
    if (!user_id) {
      return throwAuthError();
    }
    const recipe = await Recipe.findOne(voteParams.recipe_id);

    if (!recipe) {
      return false;
    }
    // Update Recipe Stats
    const reviewCount = parseInt(recipe.review_count);
    const rating_stars = parseInt(recipe.rating_stars);
    if (!voteParams.prevVote) {
      const newRatingStars = ((rating_stars * reviewCount) + voteParams.new_stars) / (reviewCount + 1);
      console.log("new vote");

      const newRecipe = {
        ...recipe,
        review_count: reviewCount + 1,
        rating_stars: newRatingStars
      }
      Object.assign(recipe, newRecipe);
      await recipe.save();

      //Save Vote Status to User

      VoteStatus.create({
        user_id: user_id,
        recipe_id: voteParams.recipe_id,
        rating_stars: voteParams.new_stars
      }).save();
    } else if (voteParams.prevVoteValue) {
      const newRatingStars = ((rating_stars * reviewCount) - voteParams.prevVoteValue + voteParams.new_stars) / reviewCount;
      console.log("Update vote");

      const newRecipe = {
        ...recipe,
        rating_stars: newRatingStars
      }
      Object.assign(recipe, newRecipe);
      await recipe.save();

      const voteStatus = await VoteStatus.findOne({
        where: {
          user_id: user_id,
          recipe_id: voteParams.recipe_id
        }
      });

      if (!voteStatus) {
        return false;
      }
      const newVoteStatus = {
        ...voteStatus,
        rating_stars: voteParams.new_stars
      };

      Object.assign(voteStatus, newVoteStatus);
      console.log(voteStatus);

      voteStatus.save();
    }
    return true;
  }


  //Add New Recipe
  @Mutation(() => Boolean)
  async addNewRecipe(
    @Arg("input") input: RecipeInput,
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ServerContext
  ): Promise<boolean> {
    const userId = parseInt(req.session.userId);
    if (!userId) {
      throw new Error("Not Authorized");
    };
    const url = await redis.get(IMAGE_UPLOAD_PREFIX + uuid);

    const recipeId = await RecipeAdder(input, url!);
    UserSavedRecipes.create({
      user_id: userId,
      recipe_id: recipeId
    }).save();
    RecipeAuthors.create({
      recipe_id: recipeId,
      user_id: userId
    }).save();

    return true;
  };

  // Update Existing Recipe
  @Mutation(() => Boolean)
  async updateRecipe(
    @Arg("id") id: number,
    @Arg("input") recipe_input: RecipeInput,
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ServerContext
  ): Promise<Boolean> {
    const userId = parseInt(req.session.userId);
    let url = await redis.get(IMAGE_UPLOAD_PREFIX + uuid);

    if (uuid === "no-update") {
      url = recipe_input.photo_url
    }

    const response = await RecipeUpdater(id, recipe_input, userId, url!);
    return response;
  };

  // Delete Owned Recipe
  @Mutation(() => Boolean)
  async deleteOwnedRecipe(
    @Arg("recipe_id") recipe_id: number,
    @Ctx() { req }: ServerContext
  ): Promise<Boolean> {
    const req_id = parseInt(req.session.userId);
    const response = await RecipeDeleter(recipe_id, req_id);
    return response;
  }
}