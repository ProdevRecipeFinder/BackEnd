import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import typeormConfig from "./typeorm-config";


const main = async () => {

    // Create Database Connection
    const conn = await createConnection(typeormConfig);

    // Run all pending migrations
    await conn.runMigrations();

    // Express back-end service for HTTP protocol
    const app = express();

    // Sets up Redis In-Memory Database
    const RedisStore = require("connect-redis")(session);

    // Redis client for interacting with the Redis Store
    const redis = new Redis();


    // Listen to incoming HTTP requests on defined port
    app.listen(4000), () => {
        console.log("Server started on localhost:4000");
    };
};


// Error if main crashes
main().catch((err) => {
    console.log(err);
});
