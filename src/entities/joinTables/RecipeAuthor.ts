import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class RecipeAuthors extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    user_id!: number;
}