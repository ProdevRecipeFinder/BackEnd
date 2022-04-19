import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserSavedRecipes } from "../entities/joinTables/UserSavedRecipe";
import { Recipe } from "../entities/Recipe";
import { User } from "../entities/User";
import { checkAuth } from "../middleware/checkAuth";
import { ServerContext } from "../types";
import { RecipeAdder } from "./helpers/recipeAdder";
import { RecipeInput } from "./ResTypes";



@Resolver(Recipe)
export class RecipeResolver {

    // **** NO PERMISSIONS **** //

    @Query(() => [Recipe], { nullable: true })
    async getAllRecipes() {
        return await Recipe.find();
    }

    //Returns one recipe
    @Query(() => Recipe, { nullable: true })
    async getOneRecipe(
        @Arg("id") id: number
    ) {
        return Recipe.findOne(id);
    }

    // **** REQUIRES PERMISSIONS **** //

    //Returns all recipes for user
    @Query(() => User, { nullable: true })
    @UseMiddleware(checkAuth)
    async getSavedRecipes(
        @Ctx() { req }: ServerContext
    ) {
        return User.findOne(req.session!.userId);
    }

    //Add New Recipe
    @Mutation(() => Recipe)
    @UseMiddleware(checkAuth)
    async addNewRecipe(
        @Arg("input") input: RecipeInput,
        @Ctx() { req }: ServerContext
    ) {


        const newRecipe = await Recipe.create({
            ...input,
        }).save();

        const author: number = parseInt(req.session.userId);


        await RecipeAdder(newRecipe, input.ingredients, input.steps, input.tags, author);

        return Recipe.findOne({
            where: {
                id: newRecipe.id
            }
        })
    }

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async saveRecipeToUser(
        @Arg("recipe_id") recipe_id: number,
        @Ctx() { req }: ServerContext
    ) {
        const user_id: number = parseInt(req.session.userId);
        await UserSavedRecipes.create({ user_id, recipe_id }).save();
        return true;
    }

    //Update Existing Recipe
    @Mutation(() => Recipe)
    @UseMiddleware(checkAuth)
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
    @UseMiddleware(checkAuth)
    async deleteOwnedRecipe(
        @Arg("id") id: number
    ): Promise<Boolean> {
        await UserSavedRecipes.delete(id);
        await Recipe.delete(id);
        return true;
    }

    //Delete Saved Recipe

    @Mutation(() => Boolean)
    @UseMiddleware(checkAuth)
    async deleteSavedRecipe(
        @Arg("recipe_id") recipe_id: number,
        @Ctx() { req }: ServerContext
    ): Promise<Boolean> {
        const user_id: number = parseInt(req.session.userId);
        await UserSavedRecipes.delete({ user_id: user_id, recipe_id: recipe_id });
        return true;
    }

}