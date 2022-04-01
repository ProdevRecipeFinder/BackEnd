import { In } from "typeorm";
import { RecipeAuthor } from "../../entities/joinTables/RecipeAuthor";
import { User } from "../../entities/User";
import DataLoader from 'dataloader';

const batchFunction = async (keys: readonly number[]) => {
    const fetchedTags = await RecipeAuthor.find({
        join: {
            alias: "RecipeAuthor",
            innerJoinAndSelect: {
                user: "RecipeAuthor.user"
            }
        },
        where: {
            recipe_id: In(keys as number[])
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
