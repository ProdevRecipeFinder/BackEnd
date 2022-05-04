import { Arg, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { PaginatedRecipe } from "../helpers/_@_ObjectTypes";


@Resolver()
export class SearchResolver {

  @Query(() => PaginatedRecipe)
  async searchRecipes(
    @Arg("search") search: string,
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("cursor", { nullable: true }) cursor: number
  ) {
    const keywords = search.split(' ');

    let queryFormat: string = '';
    let tempQuery = '';

    if (search) {
      tempQuery = keywords.join("&");
      queryFormat = tempQuery.toString();
    }

    let fetchLimit = 20;
    if (limit) {
      fetchLimit = Math.min(50, limit);
    }
    const adjustedFetchLimit = fetchLimit + 1;

    const replacements: string[] = [];


    replacements.push(queryFormat);
    replacements.push(adjustedFetchLimit.toString())

    if (cursor) {
      replacements.push(cursor.toString());
    }

    const searchQuerySQL = `
        SELECT "id" AS "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
        FROM "search_index"
        WHERE "document" @@ plainto_tsquery('english', $1) ${cursor ? `AND "id" < $3` : ""} 
        ORDER BY "id" DESC
        limit $2;`

    //ORDER BY ts_rank("document", plainto_tsquery('english', $1))

    const foundRecipes = await getManager().query(searchQuerySQL, replacements);

    return {
      recipes: foundRecipes.slice(0, fetchLimit),
      pageInfo: {
        endCursor: foundRecipes.lengts === adjustedFetchLimit ? foundRecipes[foundRecipes.length - 2].id : foundRecipes[foundRecipes.length - 1].id,
        hasNextPage: foundRecipes.length === adjustedFetchLimit
      }
    };
  }
}