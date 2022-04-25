import { ObjectType, Field } from "type-graphql";
import { Recipe } from "../../entities/Recipe";

@ObjectType()
export class PageInfo {
    @Field({ nullable: true })
    endCursor: number;
    @Field()
    hasNextPage: boolean;
}

@ObjectType()
export class PaginatedRecipe {
    @Field(() => [Recipe])
    recipes: Recipe[];
    @Field(() => PageInfo)
    pageInfo: PageInfo;
}