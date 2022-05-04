import { Recipe } from "../../entities/Recipe";
import { RecipeInput } from "../ResTypes";
import { addIngredients, addSteps } from "./addSubRows";


export const RecipeAdder = async (input: RecipeInput, newUrl: string): Promise<number> => {

  const newRecipe = await Recipe.create({
    recipe_title: input.recipe_title,
    external_author: "",
    recipe_desc: input.recipe_desc,
    prep_time_minutes: input.prep_time_minutes,
    cook_time_minutes: input.cook_time_minutes,
    total_time_minutes: input.prep_time_minutes + input.cook_time_minutes,
    footnotes: input.footnotes,
    original_url: input.original_url,
    photo_url: newUrl !== "no-update" ? newUrl : input.photo_url,
    rating_stars: "0",
    review_count: "0"
  }).save();

  await addIngredients(input.ingredients, newRecipe.id);
  await addSteps(input.instructions, newRecipe.id);

  return newRecipe.id;
}