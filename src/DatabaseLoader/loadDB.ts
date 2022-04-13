import { Ingredient } from "../entities/Ingredient";
import { RecipeIngredients } from "../entities/joinTables/RecipeIngredients";
import { RecipeSteps } from "../entities/joinTables/RecipeSteps";
import { Recipe } from "../entities/Recipe";
import { Step } from "../entities/Step";
import { DatabaseInput } from "./types";


const db = require('../../../JsonDatabase/output.json');

export const loadDb = async () => {

    const recipes: Array<DatabaseInput> = db["data"];

    for (let i = 0; i < 100; i++) {
        await addRecipe(recipes[i]);
        console.log(recipes[i]);

    }
};

const addRecipe = async (input: DatabaseInput) => {
    const newRecipe = await Recipe.create({
        recipe_title: input.recipe_title,
        external_author: input.external_author,
        recipe_desc: input.recipe_desc,
        prep_time_minutes: input.prep_time_minutes,
        cook_time_minutes: input.cook_time_minutes,
        total_time_minutes: input.total_time_minutes,
        footnotes: input.footnotes,
        original_url: input.original_url,
        photo_url: input.photo_url,
        rating_stars: input.rating_stars,
        review_count: input.review_count
    }).save();


    for (let i = 0; i < input.ingredients.length; i++) {
        const ingredient = await Ingredient.create({
            ingredient_name: input.ingredients[i].ingredient,
            ingredient_unit: input.ingredients[i].unit,
            ingredient_qty: input.ingredients[i].quantity
        }).save();

        await RecipeIngredients.create({
            recipe_id: newRecipe.id,
            ingredient_id: ingredient.id
        }).save();
    };

    for (let i = 0; i < input.instructions.length; i++) {
        const instruction = await Step.create({
            step_desc: input.instructions[i].step_desc,
        }).save();

        await RecipeSteps.create({
            recipe_id: newRecipe.id,
            step_id: instruction.id
        }).save();
    };

    console.log(newRecipe.recipe_title);
}