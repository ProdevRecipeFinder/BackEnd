import express from "express";
import session from "express-session";
import Redis from "ioredis";
import cors from "cors";
import "dotenv/config";
import { createConnection } from "typeorm";
import typeormConfig from "./typeorm-config";
import { COOKIE_NAME, ONE_DAY, __prod__ } from "./constants";


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

    // Allow request access from defined origin with enabled creditential auth
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        }));

    // Setup session with cookie initialized in redis store, attach redis client to session, set cookie params
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: ONE_DAY * 365 * 10, // 10 years 
                httpOnly: true,
                sameSite: "lax", //CSRF
                secure: __prod__
            },
            saveUninitialized: false,
            secret: process.env.COOKIE_SECRET as string,
            resave: false
        })
    );





    // Listen to incoming HTTP requests on defined port
    app.listen(4000), () => {
        console.log("Server started on localhost:4000");
    };
};


// Error if main crashes
main().catch((err) => {
    console.log(err);
});
