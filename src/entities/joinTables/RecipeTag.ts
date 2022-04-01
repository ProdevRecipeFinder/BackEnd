import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Recipe } from "../Recipe";
import { Tag } from "../Tag";

@Entity()
export class RecipeTag extends BaseEntity {
    @PrimaryColumn()
    recipe_id!: number;

    @PrimaryColumn()
    tag_id!: number;

    @ManyToOne(() => Recipe, recipe => recipe.tagConnection, { primary: true })
    @JoinColumn({ name: "recipe_id" })
    recipe: Promise<Recipe>;

    @ManyToOne(() => Tag, tag => tag.recipeTagConnection, { primary: true })
    @JoinColumn({ name: "tag_id" })
    tag: Promise<Tag>;
}