import { In } from "typeorm"
import { Recipe } from "../../entities/Recipe";
import { UserSavedRecipes } from "../../entities/joinTables/UserSavedRecipe"
import DataLoader from 'dataloader';

const batchFunction = async (keys: readonly number[]) => {
    const fetchedRecipes = await UserSavedRecipes.find({
        join: {
            alias: "UserSavedRecipes",
            innerJoinAndSelect: {
                recipe: "UserSavedRecipes.recipe"
            }
        },
        where: {
            user_id: In(keys as number[])
        }
    });

    const recipeMap: { [key: number]: Recipe[] } = {};

    fetchedRecipes.forEach(recipe => {
        if (recipe.user_id in recipeMap) {
            recipeMap[recipe.user_id].push((recipe as any).__recipe__);
        } else {
            recipeMap[recipe.user_id] = [(recipe as any).__recipe__];
        }
    });

    return keys.map(user_id => recipeMap[user_id]);


};

export const RecipeLoader = () => new DataLoader(batchFunction);