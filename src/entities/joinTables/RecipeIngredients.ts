import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Ingredient } from "../Ingredient";
import { Recipe } from "../Recipe";


@Entity()
export class RecipeIngredients extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    ingredient_id!: number;

    @ManyToOne(() => Recipe, recipe => recipe.ingredientConnection)
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;

    @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredientConnection)
    @JoinColumn({ name: "ingredient_id" })
    ingredient: Promise<Ingredient>;

}

