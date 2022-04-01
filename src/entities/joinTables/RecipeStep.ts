import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class RecipeSteps extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    step_id!: number;
}