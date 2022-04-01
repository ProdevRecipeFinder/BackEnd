import { Ctx, Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServerContext } from "../types";
import { RecipeAuthor } from "./joinTables/RecipeAuthor";
import { UserSavedRecipes } from "./joinTables/UserSavedRecipe";
import { Recipe } from "./Recipe";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ unique: true })
    user_name!: string;

    @Field(() => String)
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Field()
    @CreateDateColumn()
    created_at: Date;

    @Field()
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => UserSavedRecipes, ur => ur.user)
    recipeConnection: Promise<UserSavedRecipes[]>;

    @OneToMany(() => RecipeAuthor, ra => ra.user)
    ownRecipeConnection: Promise<RecipeAuthor[]>

    // Accessible field through API, loads related table with single SQL query
    @Field(() => [Recipe], { nullable: true })
    async savedRecipes(@Ctx() { recipeLoader }: ServerContext): Promise<Recipe[]> {
        return recipeLoader!.load(this.id)
    }
}