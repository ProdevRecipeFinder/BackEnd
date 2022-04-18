import { Arg, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Recipe } from "../../entities/Recipe";
import { searchQuerySQL } from "../helpers/searchQuery";

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

        const foundRecipes = await getManager().query(searchQuerySQL, [queryFormat]);

        return foundRecipes;
    }
}