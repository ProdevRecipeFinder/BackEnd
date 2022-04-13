import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Recipe } from "../Recipe";
import { User } from "../User";


@Entity()
export class RecipeAuthors extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    user_id!: number;

    @ManyToOne(() => Recipe, recipe => recipe.authorConnection, { primary: true })
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;

    @ManyToOne(() => User, user => user.ownRecipeConnection, { primary: true })
    @JoinColumn({ name: "user_id" })
    user: Promise<User>;
}

