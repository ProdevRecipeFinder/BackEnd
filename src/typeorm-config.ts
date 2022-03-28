import path from "path";
import { ConnectionOptions } from "typeorm";


export default {
    type: "postgres",
    database: "recipe_database",
    username: "postgres",
    password: "postgres",
    synchronize: false,
    entities: [],
    migrations: [path.join(__dirname, "./entities/migrations/*.js")],
    cli: {
        "migrationsDir": path.join(__dirname, "./entities/migrations")
    }
} as ConnectionOptions;