import { In } from "typeorm";
import { RecipeSteps } from "../../entities/joinTables/RecipeSteps";
import { Step } from "../../entities/Step";

const DataLoader = require('dataloader');

const batchFunction = async (keys: number[]) => {
    const fetchedRecipes = await RecipeSteps.find({
        join: {
            alias: "RecipeSteps",
            innerJoinAndSelect: {
                step: "RecipeSteps.step"
            }
        },
        where: {
            recipe_id: In(keys)
        }
    });

    const stepsMap: { [key: number]: Step[] } = {};

    fetchedRecipes.forEach(step => {
        if (step.recipe_id in stepsMap) {
            stepsMap[step.recipe_id].push((step as any).__step__);
        } else {
            stepsMap[step.recipe_id] = [(step as any).__step__];
        }
    });

    return keys.map(recipe_id => stepsMap[recipe_id]);


};

export const StepsLoader = () => new DataLoader(batchFunction);