import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { ServerContext } from "../types";

@Resolver(UserSavedRecipes)
export class UserSavedRecipesResolver {

    @Query(() => Boolean)
    async getSavedStatus(
        @Arg("recipe_id") recipe_id: number,
        @Ctx() { req }: ServerContext
    ) {
        const userId = parseInt(req.session.userId);

        if (!userId) {
            return false;
        }

        const found = await UserSavedRecipes.findOne({
            user_id: parseInt(req.session!.userId),
            recipe_id: recipe_id
        });
        if (!found) {
            return false;
        }
        return true;
    }
}