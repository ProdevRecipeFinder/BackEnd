import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Ingredient } from "../entities/Ingredient";

@Resolver()
export class IngredientsResolver {
    @Query(() => [Ingredient])
    getAllIngredients() {
        return Ingredient.find();
    }

    @Query(() => Ingredient)
    getOneIngredient(
        @Arg("ingredient_id") ingredient_id: number
    ) {
        return Ingredient.findOne(ingredient_id);
    }

    @Mutation(() => Ingredient)
    async createIngredient(
        @Arg("ingredient_name") ingredient_name: string,
        @Arg("ingredient_qty") ingredient_qty?: string
    ): Promise<Ingredient> {
        return Ingredient.create({ ingredient_name: ingredient_name, ingredient_qty: ingredient_qty }).save();
    }

    @Mutation(() => Boolean)
    async deleteIngredient(
        @Arg("ingredient_id") ingredient_id: number
    ): Promise<Boolean> {
        await Ingredient.delete(ingredient_id);
        return true;
    }
}