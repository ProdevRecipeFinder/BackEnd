import { UserSavedRecipes } from "../../entities/joinTables/UserSavedRecipe";
import { Recipe } from "../../entities/Recipe";
import { RecipeInput } from "../ResTypes";
import { addIngredients, addSteps } from "./addSubRows";
import { deleteIngredients, deleteSteps } from "./deleteSubRows";

export const RecipeUpdater = async (id: number, recipe_input: RecipeInput, userId: number, newUrl: string): Promise<boolean> => {
  const recipe = await Recipe.findOne(id);
  if (!recipe) {
    return false;
  }
  const author = await UserSavedRecipes.findOne({
    where: {
      recipe_id: recipe.id
    }
  });
  if (!author) {
    return false;
  };
  if (author.user_id !== userId) {
    throw new Error("Not Authorized");
  };

  await deleteIngredients(recipe.id);
  await deleteSteps(recipe.id);

  await addIngredients(recipe_input.ingredients, recipe.id);
  await addSteps(recipe_input.instructions, recipe.id);

  Object.assign(recipe, recipe_input);
  console.log("new: " + newUrl);

  recipe.photo_url = newUrl;
  await recipe.save();
  return true;
};

