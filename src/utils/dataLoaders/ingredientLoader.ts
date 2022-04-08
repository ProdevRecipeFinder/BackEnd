import { In } from "typeorm";
import { Ingredient } from "../../entities/Ingredient";
import { RecipeIngredients } from "../../entities/joinTables/RecipeIngredients";

const DataLoader = require('dataloader');

const batchFunction = async (keys: number[]) => {
    const fetchedRecipes = await RecipeIngredients.find({
        join: {
            alias: "RecipeIngredients",
            innerJoinAndSelect: {
                ingredient: "RecipeIngredients.ingredient"
            }
        },
        where: {
            recipe_id: In(keys)
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