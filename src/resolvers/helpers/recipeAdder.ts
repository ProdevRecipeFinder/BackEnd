import { In } from "typeorm";
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


export const RecipeAdder = async (recipe: Recipe, ingredients: IngredientsInput, steps: StepsInput, tags: TagsInput, author: number,) => {

    const getAuthors = await User.findOne(author)
    await RecipeAuthors.create({
        recipe_id: recipe.id,
        user_id: getAuthors?.id
    }).save();

    const getIngredients = await Ingredient.find({
        where: {
            id: In(ingredients.ingredient_id)
        }
    })
    for (const ingredient of getIngredients) {
        await RecipeIngredients.create({
            recipe_id: recipe.id,
            ingredient_id: ingredient.id
        }).save();
    }

    const getSteps = await Step.find({
        where: {
            id: In(steps.step_id)
        }
    })
    for (const step of getSteps) {
        await RecipeSteps.create({
            recipe_id: recipe.id,
            step_id: step.id
        }).save();
    }

    const getTags = await Tag.find({
        where: {
            id: In(tags.tag_id)
        }
    })
    for (const tag of getTags) {
        await RecipeTags.create({
            recipe_id: recipe.id,
            tag_id: tag.id
        }).save();
    }
}