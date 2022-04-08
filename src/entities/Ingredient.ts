import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecipeIngredients } from "./joinTables/RecipeIngredients";


@ObjectType()
@Entity()
export class Ingredient extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    ingredient_name?: string;

    @Field(() => String)
    @Column({ nullable: true })
    ingredient_unit?: string;

    @Field(() => String)
    @Column({ nullable: true })
    ingredient_qty?: string;

    @OneToMany(() => RecipeIngredients, ri => ri.ingredient)
    recipeIngredientConnection: Promise<RecipeIngredients[]>;
}
