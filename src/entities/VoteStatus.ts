import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class VoteStatus extends BaseEntity {

  @Field()
  @PrimaryColumn()
  user_id!: number;

  @Field()
  @PrimaryColumn()
  recipe_id!: number;

  @Field(() => Number)
  @Column()
  rating_stars: number;
}
