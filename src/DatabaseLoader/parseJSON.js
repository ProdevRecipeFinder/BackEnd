const fs = require( "fs" );
const rawData = fs.readFileSync( "allrecipes-recipes.json" );

const lines = rawData.toString().split( "\n" );
const output = { "data": [] };

function getIngredientsData ( ingredientsData ) {
    if ( !ingredientsData ) {
        return null;
    }
    const units = [ "cup", "cups", "gram", "grams", "ounce", "ounces", "pound", "pounds", "tablespoon", "teaspoon", "tablespoons", "teaspoons", "tsp", "tbsp", "oz", "lb" ];

    let result = ingredientsData.map( ingredient => {
        // // Check if ingredient includes any of the units in the array above
        if ( units.some( unit => ingredient.includes( unit ) ) ) {
            // get unit in ingredient
            const unit = units.find( unit => ingredient.includes( unit ) );

            const words = ingredient.split( " " );

            const indexOfUnit = words.findIndex( word => word.includes( unit ) );

            // get quantity, as indexOfUnit being the pivot. We want the left side of the array
            const quantity = words.slice( 0, indexOfUnit ).join( " " );

            // get ingredient name, as indexOfUnit being the pivot. We want the right side of the array
            const ingredientName = words.slice( indexOfUnit + 1 ).join( " " );

            return {
                "quantity": quantity.trimLeft().trimRight(),
                "unit": unit.trimLeft().trimRight(),
                "ingredient": ingredientName.trimLeft().trimRight(),
            };

        } else {
            // Search for first number in ingredient
            const words = ingredient.split( " " );
            const number = words.find( word => word.match( /\d+/g ) );

            if ( !number )
                return;

            const indexOfNumber = ingredient.indexOf( number );

            // get quantity
            const quantity = number;

            // get ingredient name
            const ingredientName = ingredient.slice( indexOfNumber + number.length );

            return {
                "quantity": quantity.trimLeft().trimRight(),
                "unit": null,
                "ingredient": ingredientName.trimLeft().trimRight(),
            };
        }
    } );

    result = result.filter( i => i !== undefined );

    return result;
}

function getInstructionsData ( instructionsData ) {
    if ( !instructionsData ) {
        return null;
    }

    let result = instructionsData.map( instruction => {
        return {
            "step_desc": instruction,
        };
    } );

    result = result.filter( i => i !== undefined );
    return result;
};

lines.forEach( bruh => {
    const line = JSON.parse( bruh );

    if ( line.cook_time_minutes !== 0 && line.prep_time_minutes !== 0 && line.total_time_minutes !== 0 ) {

        const balls = {
            "recipe_title": line[ "title" ],
            "external_author": line[ "author" ],
            "recipe_desc": line[ "description" ],
            "prep_time_minutes": line[ "prep_time_minutes" ],
            "cook_time_minutes": line[ "cook_time_minutes" ],
            "total_time_minutes": line[ "total_time_minutes" ],

            "ingredients": getIngredientsData( line[ "ingredients" ] ),
            "instructions": getInstructionsData( line[ "instructions" ] ),
            "footnotes": line[ "footnotes" ],

            "original_url": line[ "url" ],
            "photo_url": line[ "photo_url" ],
            "rating_stars": line[ "rating_stars" ],
            "review_count": line[ "review_count" ],
        };

        output[ "data" ].push( balls );
    }
} );

fs.writeFileSync( "./output.json", JSON.stringify( output ) );