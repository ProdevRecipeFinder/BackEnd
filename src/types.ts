import { Request, Response } from "express";
import { Redis } from "ioredis";
import { RecipeLoader } from "./utils/dataLoaders/recipeLoader";
import { TagsLoader } from "./utils/dataLoaders/tagsLoader";
import { AuthorsLoader } from "./utils/dataLoaders/authorLoader"
import { IngredientsLoader } from "./utils/dataLoaders/ingredientLoader";
import { StepsLoader } from "./utils/dataLoaders/stepLoader";

export type ServerContext = {
    req: Request & { session: Express.Session }; // Session cannot be undefined
    res: Response;
    redis: Redis;
    recipeLoader?: ReturnType<typeof RecipeLoader>;
    authorLoader?: ReturnType<typeof AuthorsLoader>;
    ingredientLoader?: ReturnType<typeof IngredientsLoader>;
    stepLoader?: ReturnType<typeof StepsLoader>
    tagsLoader?: ReturnType<typeof TagsLoader>;
};