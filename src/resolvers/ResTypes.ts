import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../entities/User";

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
export class RecipeInput {
    @Field()
    recipe_name!: string;

    @Field()
    recipe_desc!: string;

    @Field({ nullable: true })
    recipe_img?: string;

    @Field(() => [IngredientsInput])
    ingredients: IngredientsInput[];

    @Field(() => [StepsInput])
    steps: StepsInput[];

    @Field(() => [TagsInput], { nullable: true })
    tags: TagsInput[];

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