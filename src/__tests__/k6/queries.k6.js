import http from 'k6/http';

const accessToken = 'YOUR_GITHUB_ACCESS_TOKEN';

const query = `
query{
    getSavedRecipes{
      id
      savedRecipes{
        recipe_title
        recipeAuthors{
          user_name
        }
      }
    }
  }`;

const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
};

const res = http.post( 'https://api.github.com/graphql', JSON.stringify( { query: query } ), {
    headers: headers,
} );