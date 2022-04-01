import { In } from "typeorm";
import { Ingredient } from "../../entities/Ingredient";
import { RecipeIngredient } from "../../entities/joinTables/RecipeIngredient";
import DataLoader from 'dataloader';

const batchFunction = async (keys: readonly number[]) => {
    const fetchedRecipes = await RecipeIngredient.find({
        join: {
            alias: "RecipeIngredient",
            innerJoinAndSelect: {
                ingredient: "RecipeIngredient.ingredient"
            }
        },
        where: {
            recipe_id: In(keys as number[])
        }
    });

    const ingredientsMap: { [key: number]: Ingredient[] } = {};

    fetchedRecipes.forEach(ingredient => {
        if (ingredient.recipe_id in ingredientsMap) {
            ingredientsMap[ingredient.recipe_id].push((ingredient as any).__ingredient__);
        } else {
            ingredientsMap[ingredient.recipe_id] = [(ingredient as any).__ingredient__];
        }
    });

    return keys.map(recipe_id => ingredientsMap[recipe_id]);


};

export const IngredientsLoader = () => new DataLoader(batchFunction);