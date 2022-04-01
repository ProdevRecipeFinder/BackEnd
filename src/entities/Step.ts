import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeStep } from "./joinTables/RecipeStep";

@ObjectType()
@Entity()
export class Step extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Number)
    @Column({ nullable: true })
    step_number!: number;

    @Field(() => String)
    @Column({ nullable: true })
    step_desc?: string;

    @OneToMany(() => RecipeStep, rs => rs.step)
    recipeStepConnection: Promise<RecipeStep[]>;

}