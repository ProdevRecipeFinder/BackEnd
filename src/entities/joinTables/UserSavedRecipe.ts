import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Recipe } from "../Recipe";
import { User } from "../User";

@Entity()
export class UserSavedRecipes extends BaseEntity {

    @PrimaryColumn()
    user_id!: number;

    @PrimaryColumn()
    recipe_id!: number

    // 2 Many-to-Ones join 2 tables together with this table as the Joint table
    // Respective reference One-to-Many relations required on both referenced sides

    @ManyToOne(() => User, user => user.recipeConnection, { primary: true })
    @JoinColumn({ name: "user_id" })
    user: Promise<User>;

    @ManyToOne(() => Recipe, recipe => recipe.userConnection, { primary: true })
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;
}