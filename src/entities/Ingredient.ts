import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredients } from "./joinTables/RecipeIngredient";

@ObjectType()
@Entity()
export class Ingredient extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    ingredient_name!: string;

    @Field(() => String)
    @Column({ nullable: true })
    ingredient_qty?: string;

    @OneToMany(() => RecipeIngredients, ri => ri.ingredient)
    recipeIngredientConnection: Promise<RecipeIngredients[]>;
}