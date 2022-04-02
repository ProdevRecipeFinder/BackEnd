import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, ONE_DAY, __prod__ } from "./constants";
import { TestResolver } from "./resolvers/TestResolver";
import typeormConfig from "./typeorm-config";
import { AuthorsLoader } from './utils/dataLoaders/authorLoader';
import { IngredientsLoader } from './utils/dataLoaders/ingredientLoader';
import { RecipeLoader } from './utils/dataLoaders/recipeLoader';
import { StepsLoader } from './utils/dataLoaders/stepLoader';
import { TagsLoader } from './utils/dataLoaders/tagsLoader';


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
            secret: "random-secret",
            resave: false
        })
    );

    //Apollo GraphQL endpoint setup with request resolvers
    const apolloServer = new ApolloServer({
        plugins: [ // GraphQL old playground enabled in development only
            __prod__ ?
                ApolloServerPluginLandingPageDisabled() :
                ApolloServerPluginLandingPageGraphQLPlayground()
        ],
        schema: await buildSchema({
            resolvers: [
                TestResolver,

            ],
            validate: false,
        }),
        //Context object accessible on GraphQL queries/mutations
        //Loaders for eliminating n+1 problem
        context: ({ req, res }) => ({
            req,
            res,
            recipeLoader: RecipeLoader(),
            authorLoader: AuthorsLoader(),
            ingredientLoader: IngredientsLoader(),
            stepLoader: StepsLoader(),
            tagsLoader: TagsLoader()
        })
    });

    await apolloServer.start();
    //Listen to GraphQL via express server
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });



    // Listen to incoming HTTP requests on defined port
    app.listen(4000), () => {
        console.log("Server started on localhost:4000");
    };
};


// Error if main crashes
main().catch((err) => {
    console.log(err);
});
