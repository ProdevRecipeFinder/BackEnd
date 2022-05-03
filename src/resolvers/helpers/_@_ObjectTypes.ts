import { ObjectType, Field } from "type-graphql";
import { Recipe } from "../../entities/Recipe";
import { User } from "../../entities/User";

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

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  user?: User;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class DeleteRequest {
  @Field()
  request: boolean;
}