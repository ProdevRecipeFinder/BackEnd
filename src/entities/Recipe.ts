import { ObjectType, Field, Ctx } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ServerContext } from "../types";
import { Ingredient } from "./Ingredient";
import { RecipeAuthor } from "./joinTables/RecipeAuthor";
import { RecipeIngredient } from "./joinTables/RecipeIngredient";
import { RecipeStep } from "./joinTables/RecipeStep";
import { RecipeTag } from "./joinTables/RecipeTag";
import { UserSavedRecipes } from "./joinTables/UserSavedRecipe";
import { Step } from "./Step";
import { Tag } from "./Tag";
import { User } from "./User";

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

    @OneToMany(() => RecipeAuthor, ra => ra.recipe)
    authorConnection: Promise<RecipeAuthor[]>

    @OneToMany(() => RecipeIngredient, ri => ri.recipe)
    ingredientConnection: Promise<RecipeIngredient[]>;

    @OneToMany(() => RecipeStep, rs => rs.recipe)
    stepConnection: Promise<RecipeStep[]>

    @OneToMany(() => RecipeTag, rt => rt.tag)
    tagConnection: Promise<RecipeTag[]>

    @Field(() => [User], { nullable: true })
    async recipeAuthors(@Ctx() { authorLoader }: ServerContext): Promise<User[]> {
        return authorLoader!.load(this.id);
    }

    @Field(() => [Ingredient], { nullable: true })
    async recipeIngredients(@Ctx() { ingredientLoader }: ServerContext): Promise<Ingredient[]> {
        return ingredientLoader!.load(this.id);
    }

    @Field(() => [Step], { nullable: true })
    async recipeSteps(@Ctx() { stepLoader }: ServerContext): Promise<Step[]> {
        return stepLoader!.load(this.id);
    }

    @Field(() => [Tag], { nullable: true })
    async recipeTags(@Ctx() { tagsLoader }: ServerContext): Promise<Tag[]> {
        return tagsLoader!.load(this.id);
    }

}