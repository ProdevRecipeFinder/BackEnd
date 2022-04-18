export const searchQuerySQL = `
SELECT "id" AS "id", "recipe_title", "recipe_desc", "photo_url", "rating_stars", "review_count"
FROM "search_index"
WHERE "document" @@ plainto_tsquery('english', $1)
ORDER BY ts_rank("document", plainto_tsquery('english', $1)) DESC;`