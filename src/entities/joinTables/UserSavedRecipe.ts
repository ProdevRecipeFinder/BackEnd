import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Recipe } from "../Recipe";
import { User } from "../User";


@Entity()
export class UserSavedRecipes extends BaseEntity {

    @PrimaryColumn()
    user_id!: number;

    @PrimaryColumn()
    recipe_id!: number

    @ManyToOne(() => User, user => user.recipeConnection, { primary: true })
    @JoinColumn({ name: "user_id" })
    user: Promise<User>;

    @ManyToOne(() => Recipe, recipe => recipe.userConnection, { primary: true })
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;
}

