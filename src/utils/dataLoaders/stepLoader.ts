import { In } from "typeorm";
import { RecipeStep } from "../../entities/joinTables/RecipeStep";
import { Step } from "../../entities/Step";
import DataLoader from 'dataloader';

const batchFunction = async (keys: readonly number[]) => {
    const fetchedRecipes = await RecipeStep.find({
        join: {
            alias: "RecipeStep",
            innerJoinAndSelect: {
                step: "RecipeStep.step"
            }
        },
        where: {
            recipe_id: In(keys as number[])
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