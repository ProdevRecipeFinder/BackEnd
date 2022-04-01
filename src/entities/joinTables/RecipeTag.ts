import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class RecipeTags extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    tag_id!: number;
}