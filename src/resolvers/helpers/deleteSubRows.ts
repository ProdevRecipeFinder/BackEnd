import { Ingredient } from "../../entities/Ingredient";
import { RecipeIngredients } from "../../entities/joinTables/RecipeIngredients";
import { RecipeSteps } from "../../entities/joinTables/RecipeSteps";
import { Step } from "../../entities/Step";

export const deleteIngredients = async (id: number) => {
  const recipeIngredients = await RecipeIngredients.find({
    where: {
      recipe_id: id
    }
  });
  await RecipeIngredients.delete({
    recipe_id: id
  });
  for (let i = 0; i < recipeIngredients.length; i++) {
    await Ingredient.delete({
      id: recipeIngredients[i].ingredient_id
    })
  };
}

export const deleteSteps = async (id: number) => {
  const recipeSteps = await RecipeSteps.find({
    where: {
      recipe_id: id
    }
  });
  await RecipeSteps.delete({
    recipe_id: id
  });
  for (let i = 0; i < recipeSteps.length; i++) {
    await Step.delete({
      id: recipeSteps[i].step_id
    })
  };
}


