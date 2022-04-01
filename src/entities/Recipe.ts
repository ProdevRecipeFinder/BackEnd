import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { RecipeAuthors } from "./joinTables/RecipeAuthor";
import { RecipeIngredients } from "./joinTables/RecipeIngredient";
import { RecipeSteps } from "./joinTables/RecipeStep";
import { RecipeTags } from "./joinTables/RecipeTag";
import { UserSavedRecipes } from "./joinTables/UserSavedRecipe";

@ObjectType() // For type-graphql API
@Entity() // For TypeORM
export class Recipe extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    recipe_name!: string;

    @Field()
    @Column()
    recipe_desc!: string;

    @Field()
    @Column({ nullable: true })
    recipe_img?: string;

    @Field()
    @CreateDateColumn()
    created_at!: Date

    @Field()
    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => UserSavedRecipes, ur => ur.recipe)
    userConnection: Promise<UserSavedRecipes[]>

    @OneToMany(() => RecipeAuthors, ra => ra.recipe)
    authorConnection: Promise<RecipeAuthors[]>

    @OneToMany(() => RecipeIngredients, ri => ri.recipe)
    ingredientConnection: Promise<RecipeIngredients[]>;

    @OneToMany(() => RecipeSteps, rs => rs.recipe)
    stepConnection: Promise<RecipeSteps[]>

    @OneToMany(() => RecipeTags, rt => rt.tag)
    tagConnection: Promise<RecipeTags[]>

}