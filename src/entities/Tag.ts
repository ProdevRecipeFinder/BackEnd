import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeTag } from "./joinTables/RecipeTag";

@ObjectType()
@Entity()
export class Tag extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ unique: true })
    tag_name!: string;

    @Field(() => String)
    @Column({ nullable: true })
    tag_desc?: string;

    @OneToMany(() => RecipeTag, rt => rt.tag)
    recipeTagConnection: Promise<RecipeTag[]>
}