import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Recipe } from "../Recipe";
import { User } from "../User";

@Entity()
export class RecipeAuthors extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    user_id!: number;

    // 2 Many-to-Ones join 2 tables together with this table as the Joint table
    // Respective reference One-to-Many relations required on both referenced sides

    @ManyToOne(() => Recipe, recipe => recipe.authorConnection, { primary: true })
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;

    @ManyToOne(() => User, user => user.ownRecipeConnection, { primary: true })
    @JoinColumn({ name: "user_id" })
    user: Promise<User>;
}