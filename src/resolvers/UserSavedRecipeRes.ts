import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { ServerContext } from "../types";

@Resolver(UserSavedRecipes)
export class UserSavedRecipesResolver {

    @Query(() => [Boolean])
    async getSavedStatus(
        @Arg("recipe_ids", () => [Number]) recipe_ids: number[],
        @Ctx() { req }: ServerContext
    ) {
        let responseArray: boolean[] = [];
        const userId: number = req.session.userId;
        if (!userId) {
            return [];
        }

        for (let i = 0; i < recipe_ids.length; i++) {
            const found = await UserSavedRecipes.findOne({
                user_id: userId,
                recipe_id: recipe_ids[i]
            });
            if (!found) {
                responseArray.push(false);
            } else {
                responseArray.push(true);
            }
        }

        return responseArray;
    }
}