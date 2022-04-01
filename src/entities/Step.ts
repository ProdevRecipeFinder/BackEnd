import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

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

}