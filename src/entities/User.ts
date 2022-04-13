import { Ctx, Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServerContext } from "../types";
import { RecipeAuthors } from "./joinTables/RecipeAuthor";
import { Recipe } from "./Recipe";
import { UserSavedRecipes } from "./joinTables/UserSavedRecipe";


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

    @OneToMany(() => RecipeAuthors, ra => ra.user)
    ownRecipeConnection: Promise<RecipeAuthors[]>

    @Field(() => [Recipe], { nullable: true })
    async savedRecipes(@Ctx() { recipeLoader }: ServerContext): Promise<Recipe[]> {
        return recipeLoader!.load(this.id)
    }
}
