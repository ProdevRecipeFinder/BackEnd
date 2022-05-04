import { Field, InputType } from "type-graphql";

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

@InputType()
export class IngredientsInput {

  @Field(() => String)
  ingredient_name?: string;

  @Field(() => String)
  ingredient_unit?: string;

  @Field(() => String)
  ingredient_qty?: string;
}

@InputType()
export class StepsInput {

  @Field(() => String)
  step_desc!: string
}

@InputType()
export class TagsInput {

  @Field(() => String)
  tag_name: string;

  @Field(() => [String])
  tag_desc: string;
}

@InputType()
export class RegInfo {
  @Field()
  user_name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class LoginInfo {
  @Field()
  username: string;

  @Field()
  password!: string;
}

@InputType()
export class VoteParams {
  @Field()
  recipe_id!: number;

  @Field()
  new_stars!: number;

  @Field()
  prevVote!: boolean;

  @Field({ nullable: true })
  prevVoteValue!: number;
}