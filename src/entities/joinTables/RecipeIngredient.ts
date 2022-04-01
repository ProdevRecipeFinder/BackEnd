import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Ingredient } from "../Ingredient";
import { Recipe } from "../Recipe";

@Entity()
export class RecipeIngredients extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    ingredient_id!: number;

    // 2 Many-to-Ones join 2 tables together with this table as the Joint table
    // Respective reference One-to-Many relations required on both referenced sides

    @ManyToOne(() => Recipe, recipe => recipe.ingredientConnection)
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;

    @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredientConnection)
    @JoinColumn({ name: "ingredient_id" })
    ingredient: Promise<Ingredient>;
}