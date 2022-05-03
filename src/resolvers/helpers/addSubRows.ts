import { Ingredient } from "../../entities/Ingredient";
import { RecipeIngredients } from "../../entities/joinTables/RecipeIngredients";
import { RecipeSteps } from "../../entities/joinTables/RecipeSteps";
import { Step } from "../../entities/Step";
import { IngredientInputType, InstructionInputType } from "../ResTypes"

export const addIngredients = async (ingredients: IngredientInputType[], id: number) => {

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = await Ingredient.create({
      ingredient_name: ingredients[i].ingredient,
      ingredient_unit: ingredients[i].unit,
      ingredient_qty: ingredients[i].quantity
    }).save();

    await RecipeIngredients.create({
      recipe_id: id,
      ingredient_id: ingredient.id
    }).save();
  };
};

export const addSteps = async (instructions: InstructionInputType[], id: number) => {

  for (let i = 0; i < instructions.length; i++) {
    const instruction = await Step.create({
      step_desc: instructions[i].step_desc,
    }).save();


    await RecipeSteps.create({
      recipe_id: id,
      step_id: instruction.id
    }).save();
  };
};