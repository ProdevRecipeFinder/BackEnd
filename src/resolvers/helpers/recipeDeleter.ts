import { UserSavedRecipes } from "../../entities/joinTables/UserSavedRecipe";
import { Recipe } from "../../entities/Recipe";
import { deleteAuthor, deleteIngredients, deleteSteps } from "./deleteSubRows";

export const RecipeDeleter = async (id: number, req_id: number): Promise<boolean> => {

  const recipe = await Recipe.findOne(id);
  if (!recipe) {
    return false;
  };
  const author = await UserSavedRecipes.findOne({ //make sure owner has saved recipe in table
    where: {
      recipe_id: recipe.id
    }
  });
  if (!author) {
    return false;
  };
  if (author.user_id !== req_id) {
    throw new Error("Not Authorized");
  };

  await deleteIngredients(recipe.id);

  await deleteSteps(recipe.id);

  await deleteAuthor(recipe.id);

  await UserSavedRecipes.delete({
    recipe_id: recipe.id
  });

  await Recipe.delete({
    id: recipe.id
  })

  return true;
}