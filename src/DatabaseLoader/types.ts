export class DatabaseInput {
    recipe_title: string;
    external_author: string;
    recipe_desc: string;
    prep_time_minutes: number;
    cook_time_minutes: number;
    total_time_minutes: number;
    ingredients: [{
        ingredient: string;
        unit: string;
        quantity: string;
    }];
    instructions: [{
        step_desc: string;
    }];
    footnotes: string[];
    original_url: string;
    photo_url: string;
    rating_stars: string;
    review_count: string;
}