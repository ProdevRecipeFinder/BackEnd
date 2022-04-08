import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";
import { createConnection, getConnection } from "typeorm";
import { COOKIE_NAME, ONE_DAY, __prod__ } from "./constants";
import { loadDb } from './DatabaseLoader/loadDB';
import { IngredientsResolver } from './resolvers/IngredientRes';
import { RecipeResolver } from "./resolvers/RecipeRes";
import { StepsResolver } from './resolvers/StepRes';
import { TagsResolver } from "./resolvers/TagsRes";
import { UserResolver } from "./resolvers/UserRes";
import typeormConfig from "./typeorm-config";
import { AuthorsLoader } from './utils/dataLoaders/authorLoader';
import { IngredientsLoader } from './utils/dataLoaders/ingredientLoader';
import { RecipeLoader } from "./utils/dataLoaders/recipeLoader";
import { StepsLoader } from './utils/dataLoaders/stepLoader';
import { TagsLoader } from './utils/dataLoaders/tagsLoader';



const main = async () => {

    //DB connection with TypeORM
    const conn = await createConnection(typeormConfig);
    //Auto-run all pending migrations
    await conn.runMigrations();

    // await loadDb();

    //Express back-end server
    const app = express();

    //Redis Session Store
    const RedisStore = require("connect-redis")(session);
    const redis = new Redis();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        }))

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
    )


    //Apollo GraphQL endpoint
    const apolloServer = new ApolloServer({
        plugins: [ // GraphQL old playground
            process.env.NODE_ENV === 'production'
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerLoaderPlugin({
                typeormGetConnection: getConnection,  // for use with TypeORM
            }),
        ],
        schema: await buildSchema({
            resolvers: [
                RecipeResolver,
                UserResolver,
                IngredientsResolver,
                StepsResolver,
                TagsResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
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

    //Express port
    app.listen(4000), () => {
        console.log("Express Server started on localhost:4000")
    };
};

main().catch((err) => {
    console.log(err);
});