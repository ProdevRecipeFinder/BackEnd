import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeSteps } from "./joinTables/RecipeStep";

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

    @OneToMany(() => RecipeSteps, rs => rs.step)
    recipeStepConnection: Promise<RecipeSteps[]>;

}