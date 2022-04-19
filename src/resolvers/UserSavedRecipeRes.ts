import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { ServerContext } from "../types";

@Resolver(UserSavedRecipes)
export class UserSavedRecipesResolver {

    @Query(() => [Boolean])
    async getSavedStatus(
<<<<<<< HEAD
        @Arg("recipe_ids", () => [Number]) recipe_ids: number[],
=======
        @Arg("recipe_id") recipe_ids: [number],
>>>>>>> 7f96cc3d53ee01fcf3aa104541712ff07b6be138
        @Ctx() { req }: ServerContext
    ) {

        let responseArray: boolean[] = [];
        const userId: number = req.session.userId;
        if (!userId) {
            return false
        }

        for (let i = 0; i < recipe_ids.length; i++) {
            const found = await UserSavedRecipes.findOne({
                user_id: userId,
                recipe_id: recipe_ids[i]
            });
            if (!found) {
                responseArray.push(false);
            }
            responseArray.push(true);
        }

        return responseArray;
    }
}