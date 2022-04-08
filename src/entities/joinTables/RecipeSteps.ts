import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Recipe } from "../Recipe";
import { Step } from "../Step";


@Entity()
export class RecipeSteps extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    step_id!: number;

    @ManyToOne(() => Recipe, recipe => recipe.stepConnection)
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;

    @ManyToOne(() => Step, step => step.recipeStepConnection)
    @JoinColumn({ name: "step_id" })
    step: Promise<Step>;

}

