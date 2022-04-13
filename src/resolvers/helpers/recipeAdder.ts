import { Ingredient } from "../../entities/Ingredient";
import { RecipeAuthors } from "../../entities/joinTables/RecipeAuthor";
import { RecipeIngredients } from "../../entities/joinTables/RecipeIngredients";
import { RecipeSteps } from "../../entities/joinTables/RecipeSteps";
import { RecipeTags } from "../../entities/joinTables/RecipeTags";
import { Recipe } from "../../entities/Recipe";
import { Step } from "../../entities/Step";
import { Tag } from "../../entities/Tag";
import { User } from "../../entities/User";
import { IngredientsInput, StepsInput, TagsInput } from "../ResTypes";


export const RecipeAdder = async (recipe: Recipe, ingredients: IngredientsInput[], steps: StepsInput[], tags: TagsInput[], author: number,) => {

    const getAuthors = await User.findOne(author)
    await RecipeAuthors.create({
        recipe_id: recipe.id,
        user_id: getAuthors?.id
    }).save();

    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = await Ingredient.create({
            ingredient_name: ingredients[i].ingredient_name,
            ingredient_unit: ingredients[i].ingredient_unit,
            ingredient_qty: ingredients[i].ingredient_unit
        }).save();

        await RecipeIngredients.create({
            recipe_id: recipe.id,
            ingredient_id: ingredient.id
        }).save();
    }

    for (let i = 0; i < steps.length; i++) {
        const step = await Step.create({
            step_desc: steps[i].step_desc,
        }).save();

        await RecipeSteps.create({
            recipe_id: recipe.id,
            step_id: step.id
        }).save();
    }

    for (let i = 0; i < tags.length; i++) {
        const tag = await Tag.create({
            tag_name: tags[i].tag_name,
            tag_desc: tags[i].tag_desc
        }).save();

        await RecipeTags.create({
            recipe_id: recipe.id,
            tag_id: tag.id
        }).save();
    }
}