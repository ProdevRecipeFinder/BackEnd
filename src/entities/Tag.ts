import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecipeTags } from "./joinTables/RecipeTags";


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

    @OneToMany(() => RecipeTags, rt => rt.tag)
    recipeTagConnection: Promise<RecipeTags[]>
}
