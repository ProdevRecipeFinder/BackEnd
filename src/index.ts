import { createConnection } from "typeorm";
import typeormConfig from "./typeorm-config";


const main = async () => {

    // Create Database Connection
    const conn = await createConnection(typeormConfig);

    // Run all pending migrations
    await conn.runMigrations();

}


// Error if main crashes
main().catch((err) => {
    console.log(err);
});
