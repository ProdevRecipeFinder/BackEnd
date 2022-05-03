import { Request, Response } from "express";
import { Redis } from "ioredis";
import { AuthorsLoader } from "./utils/dataLoaders/authorLoader";
import { IngredientsLoader } from "./utils/dataLoaders/ingredientLoader";
import { StepsLoader } from "./utils/dataLoaders/stepLoader";

export type ServerContext = {
  req: Request & { session: Express.Session }; // Session cannot be undefined
  res: Response;
  redis: Redis;
  authorLoader?: ReturnType<typeof AuthorsLoader>;
  ingredientLoader?: ReturnType<typeof IngredientsLoader>;
  stepLoader?: ReturnType<typeof StepsLoader>
};

export type UploadRequest = {
  image: File;
}