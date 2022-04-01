import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

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

}