import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { checkAuth } from "../middleware/checkAuth";
import { ServerContext } from "../types";

@Resolver(UserSavedRecipes)
export class UserSavedRecipesResolver {

    @Query(() => Boolean)
    @UseMiddleware(checkAuth)
    async getSavedStatus(
        @Arg("recipe_id") recipe_id: number,
        @Ctx() { req }: ServerContext
    ) {
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