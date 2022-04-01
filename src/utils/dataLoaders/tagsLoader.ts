import { In } from "typeorm";
import { RecipeTag } from "../../entities/joinTables/RecipeTag";
import { Tag } from "../../entities/Tag";
import DataLoader from 'dataloader';

const batchFunction = async (keys: readonly number[]) => {
    const fetchedTags = await RecipeTag.find({
        join: {
            alias: "RecipeTag",
            innerJoinAndSelect: {
                tag: "RecipeTag.tag"
            }
        },
        where: {
            recipe_id: In(keys as number[])
        }
    });

    const tagsMap: { [key: number]: Tag[] } = {};

    fetchedTags.forEach(tag => {
        if (tag.recipe_id in tagsMap) {
            tagsMap[tag.recipe_id].push((tag as any).__tag__);
        } else {
            tagsMap[tag.recipe_id] = [(tag as any).__tag__];
        }
    });

    return keys.map(recipe_id => tagsMap[recipe_id]);
};

export const TagsLoader = () => new DataLoader(batchFunction);