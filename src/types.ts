import { Request, Response } from "express";
import { Redis } from "ioredis";
import { TagsLoader } from "./utils/dataLoaders/tagsLoader";
import { AuthorsLoader } from "./utils/dataLoaders/authorLoader"
import { IngredientsLoader } from "./utils/dataLoaders/ingredientLoader";
import { StepsLoader } from "./utils/dataLoaders/stepLoader";
import { InputType, Field } from "type-graphql"

export type ServerContext = {
    req: Request & { session: Express.Session }; // Session cannot be undefined
    res: Response;
    redis: Redis;
    authorLoader?: ReturnType<typeof AuthorsLoader>;
    ingredientLoader?: ReturnType<typeof IngredientsLoader>;
    stepLoader?: ReturnType<typeof StepsLoader>
    tagsLoader?: ReturnType<typeof TagsLoader>;
};

@InputType()
export class RecipeInput {
    @Field()
    recipe_title: string;

    @Field()
    recipe_desc: string;

    @Field()
    prep_time_minutes: number;

    @Field()
    cook_time_minutes: number;

    @Field(() => [IngredientInputType])
    ingredients: [{
        ingredient: string;
        unit: string;
        quantity: string;
    }];

    @Field(() => [InstructionInputType])
    instructions: [{
        step_desc: string;
    }];

    @Field(() => [String])
    footnotes: string[];

    @Field()
    original_url: string;

    @Field()
    photo_url: string;
}

@InputType()
export class IngredientInputType {
    @Field()
    ingredient: string;

    @Field()
    unit: string;

    @Field()
    quantity: string;
}

@InputType()
export class InstructionInputType {
    @Field()
    step_desc: string;
}