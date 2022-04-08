import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { Recipe } from "../entities/Recipe";
import { User } from "../entities/User";
import { ServerContext } from "../types";
import { RecipeAdder } from "./helpers/recipeAdder";
import { IngredientsInput, RecipeInput, StepsInput, TagsInput } from "./ResTypes";



@Resolver(Recipe)
export class RecipeResolver {

    // **** NO PERMISSIONS **** //

    @Query(() => [Recipe], { nullable: true })
    async getAllRecipes() {
        return await Recipe.find();
    }


    //Returns all recipes for user
    @Query(() => User, { nullable: true })
    async getSavedRecipes(
        @Ctx() { req }: ServerContext
    ) {
        return User.findOne(req.session!.userId);
    }

    //Returns one recipe
    @Query(() => Recipe, { nullable: true })
    async getOneRecipe(
        @Arg("id") id: number
    ) {
        return Recipe.findOne(id);
    }

    //Add New Recipe
    @Mutation(() => Recipe)
    async addNewRecipe(
        @Arg("input") recipe_input: RecipeInput,
        @Arg("ingredients") ingredients: IngredientsInput,
        @Arg("steps") steps: StepsInput,
        @Arg("tags") tags: TagsInput,
        @Ctx() { req }: ServerContext
    ) {
        const newRecipe = await Recipe.create({
            ...recipe_input,
        }).save();

        const author: number = parseInt(req.session.userId);

        await RecipeAdder(newRecipe, ingredients, steps, tags, author);

        return Recipe.findOne({
            where: {
                id: newRecipe.id
            }
        })
    }

    //Add Recipe to joint table
    //For new recipe, addNewRecipe ==> get the returned JSON ==> addUserSavedRecipe with current session userId
    //For recipe already in DB (different author) ==> find recipe ==> addUserSavedRecipe with current session userId

    @Mutation(() => Boolean)
    async saveRecipeToUser(
        @Arg("recipe_id") recipe_id: number,
        @Arg("user_id") user_id: number
    ) {
        await UserSavedRecipes.create({ user_id, recipe_id }).save();
        return true;
    }

    //Update Existing Recipe
    @Mutation(() => Recipe)
    async updateRecipe(
        @Arg("id") id: number,
        @Arg("input") recipe_input: RecipeInput
    ): Promise<Recipe | undefined> {
        const recipe = await Recipe.findOne(id);
        if (!recipe) {
            return undefined;
        }
        Object.assign(recipe, recipe_input);
        await recipe.save();
        return recipe;
    }

    //Delete Owned Recipe
    @Mutation(() => Recipe)
    async deleteOwnedRecipe(
        @Arg("id") id: number
    ): Promise<Boolean> {
        await UserSavedRecipes.delete(id);
        await Recipe.delete(id);
        return true;
    }

    //Delete Saved Recipe

    @Mutation(() => Recipe)
    async deleteSavedRecipe(
        @Arg("user_id") user_id: number,
        @Arg("recipe_id") recipe_id: number
    ): Promise<Boolean> {
        await UserSavedRecipes.delete({ user_id: user_id, recipe_id: recipe_id });
        return true;
    }

}