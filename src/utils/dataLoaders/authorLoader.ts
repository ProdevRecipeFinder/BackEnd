import { In } from "typeorm";
import { RecipeAuthors } from "../../entities/joinTables/RecipeAuthor";
import { User } from "../../entities/User";

const DataLoader = require('dataloader');

const batchFunction = async (keys: number[]) => {
    const fetchedTags = await RecipeAuthors.find({
        join: {
            alias: "RecipeAuthors",
            innerJoinAndSelect: {
                user: "RecipeAuthors.user"
            }
        },
        where: {
            recipe_id: In(keys)
        }
    });

    const usersMap: { [key: number]: User[] } = {};

    fetchedTags.forEach(user => {
        if (user.recipe_id in usersMap) {
            usersMap[user.recipe_id].push((user as any).__user__);
        } else {
            usersMap[user.recipe_id] = [(user as any).__user__];
        }
    });

    return keys.map(recipe_id => usersMap[recipe_id]);
};

export const AuthorsLoader = () => new DataLoader(batchFunction);
