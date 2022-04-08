import { In } from "typeorm";
import { RecipeTags } from "../../entities/joinTables/RecipeTags";
import { Tag } from "../../entities/Tag";

const DataLoader = require('dataloader');

const batchFunction = async (keys: number[]) => {
    const fetchedTags = await RecipeTags.find({
        join: {
            alias: "RecipeTags",
            innerJoinAndSelect: {
                tag: "RecipeTags.tag"
            }
        },
        where: {
            recipe_id: In(keys)
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