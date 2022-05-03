import { Arg, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Recipe } from "../../entities/Recipe";

@Resolver()
export class SearchResolver {
    @Query(() => [Recipe])
    async searchRecipes(
        @Arg("search") search: string
    ) {

        console.log("called: " + search);

        const keywords = search.split(" ");

        let queryFormat: string = '';

        //If only one search-term provided
        if (keywords.length < 1) {
            // If multiple search-terms provided
            for (let i = 0; i < keywords.length; i++) {
                queryFormat.concat(' ', keywords[i]);
            }
        } else {
            queryFormat = search;
        }


        const searchQuerySQL = `
        SELECT "id" AS "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
        FROM "search_index"
        WHERE "document" @@ plainto_tsquery('english', $1)
        ORDER BY ts_rank("document", plainto_tsquery('english', $1)) DESC;`

        const foundRecipes = await getManager().query(searchQuerySQL, [queryFormat]);

        return foundRecipes;
    }
}