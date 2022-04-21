import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Recipe } from "../../entities/Recipe";

@ObjectType()
class PageInfo {
    @Field({ nullable: true })
    endCursor: number;
    @Field()
    hasNextPage: boolean;
}

@ObjectType()
class PaginatedSearch {
    @Field(() => [Recipe])
    recipes: Recipe[];
    @Field(() => PageInfo)
    pageInfo: PageInfo;
}



@Resolver()
export class SearchResolver {

    @Query(() => PaginatedSearch)
    async searchRecipes(
        @Arg("search") search: string,
        @Arg("limit", { nullable: true }) limit: number,
        @Arg("cursor", { nullable: true }) cursor: number
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
        let fetchLimit = 20;
        if (limit) {
            fetchLimit = Math.min(50, limit);
        }
        const adjustedFetchLimit = fetchLimit + 1;

        const replacements: Array<String> = [];

        replacements.push(queryFormat);
        replacements.push(adjustedFetchLimit.toString())

        if (cursor) {
            replacements.push(cursor.toString());
        }

        console.log(replacements);



        const searchQuerySQL = `
        SELECT "id" AS "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
        FROM "search_index"
        WHERE "document" @@ plainto_tsquery('english', $1) ${cursor ? `AND "id" < $3` : ""} 
        ORDER BY "id" DESC
        limit $2;`

        //ORDER BY ts_rank("document", plainto_tsquery('english', $1))

        const foundRecipes = await getManager().query(searchQuerySQL, replacements);

        console.log(foundRecipes);


        return {
            recipes: foundRecipes.slice(0, fetchLimit),
            pageInfo: {
                endCursor: foundRecipes.lengts === adjustedFetchLimit ? foundRecipes[foundRecipes.length - 2].id : foundRecipes[foundRecipes.length - 1].id,
                hasNextPage: foundRecipes.length === adjustedFetchLimit
            }
        };
    }
}