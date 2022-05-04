import path from "path";
import { ConnectionOptions } from "typeorm";
import { Ingredient } from "./entities/Ingredient";
import { RecipeAuthors } from "./entities/joinTables/RecipeAuthor";
import { RecipeIngredients } from "./entities/joinTables/RecipeIngredients";
import { RecipeSteps } from "./entities/joinTables/RecipeSteps";
import { UserSavedRecipes } from "./entities/joinTables/UserSavedRecipe";
import { Recipe } from "./entities/Recipe";
import { Step } from "./entities/Step";
import { User } from "./entities/User";
import { VoteStatus } from "./entities/VoteStatus";
import "dotenv-safe/config";

export default {
  type: "postgres",
  url: "postgresql://postgres:postgres@127.0.0.1:5432/recipes_db_deployment",
  synchronize: false,
  entities: [
    User,
    Recipe,
    UserSavedRecipes,
    RecipeAuthors,
    Ingredient,
    RecipeIngredients,
    Step,
    RecipeSteps,
    VoteStatus
  ],
  migrations: [path.join(__dirname, "./entities/migrations/*.js")],
  cli: {
    "migrationsDir": path.join(__dirname, "./entities/migrations")
  }
} as ConnectionOptions;
