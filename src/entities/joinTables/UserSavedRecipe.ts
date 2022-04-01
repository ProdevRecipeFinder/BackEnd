import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class UserSavedRecipes extends BaseEntity {

    @PrimaryColumn()
    user_id!: number;

    @PrimaryColumn()
    recipe_id!: number
}