import { EntityRepository, Repository } from "typeorm";
// import { Category } from "../entities/Category";
// import { Diet } from "../entities/Diet";
import { Recipe } from "../entities/Recipe";


@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {

    // async findAllInCategory(cat_id?: number, cat_name?: string) {
    //     if (cat_id) {
    //         const cat = await Category.findOne(cat_id);
    //         return this.find({ category: cat })
    //     } else {
    //         const cat = await Category.findOne(cat_name);
    //         return this.find({ category: cat })
    //     }
    // }

    // async findAllInDiet(diet_id?: number, diet_name?: string) {
    //     if (diet_id) {
    //         const diet = await Diet.findOne(diet_id);
    //         return this.find({ diet: diet })
    //     } else {
    //         const diet = await Diet.findOne(diet_name);
    //         return this.find({ diet: diet })
    //     }
    // }

    // async findAllInSelection(cat_id?: number, diet_id?: number, cuisine_id?: number) {
    //     if (cat_id && diet_id && cuisine_id) {
    //         const cat = await Category.findOne(cat_id);
    //         const diet = await Diet.findOne(diet_id);

    //         return this.find({ category: cat, diet: diet })
    //     } else if (cat_id && diet_id) {
    //         // IMPLEMENT THIS or find better way!!!
    //         return undefined
    //     }
    //     else {
    //         return undefined
    //     }
    // }

}