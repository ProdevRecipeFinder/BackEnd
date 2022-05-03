import { UserSavedRecipes } from "../../entities/joinTables/UserSavedRecipe"
import { User } from "../../entities/User";


export const UserDeleter = async (id: number) => {

    // Delete user saved recipes

    await UserSavedRecipes.delete({
        user_id: id
    });

    await User.delete({
        id: id
    })
}