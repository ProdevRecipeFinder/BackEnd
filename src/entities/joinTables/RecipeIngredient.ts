import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class RecipeIngredients extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    ingredient_id!: number;
}