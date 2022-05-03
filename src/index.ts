import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import fileUpload from 'express-fileupload';
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";
import { createConnection, getConnection } from "typeorm";
import { COOKIE_NAME, IMAGE_UPLOAD_PREFIX, ONE_DAY, __prod__ } from "./constants";
import { SearchResolver } from './resolvers/ft_search/searchRes';
import { RecipeResolver } from "./resolvers/RecipeRes";
import { UserResolver } from "./resolvers/UserRes";
import { UserSavedRecipesResolver } from './resolvers/UserSavedRecipeRes';
import typeormConfig from "./typeorm-config";
import { AuthorsLoader } from './utils/dataLoaders/authorLoader';
import { IngredientsLoader } from './utils/dataLoaders/ingredientLoader';
import { StepsLoader } from './utils/dataLoaders/stepLoader';
import { TagsLoader } from './utils/dataLoaders/tagsLoader';
import { convertToBase64 } from './utils/imageUploader';
// import { loadDb } from "./DatabaseLoader/loadDB";


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

  app.use(fileUpload());
  // app.use(bodyParser);


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
        SearchResolver,
        UserSavedRecipesResolver
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
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

  app.post('/upload-image', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    // const recipe_id = req.body.recipe_id
    const reqJSON = JSON.stringify(req.files.file);
    const imageJSON = JSON.parse(reqJSON);
    const filename = imageJSON.name;
    const imageData = JSON.stringify(imageJSON.data.data[0]);
    console.log(imageJSON);

    const base64Img = convertToBase64(imageData);
    console.log(base64Img);


    await redis.set(IMAGE_UPLOAD_PREFIX + filename, base64Img, 'ex', 1000 * 60 * 20);

    //Store in redis with prefix and recipe-id as key ===

    //Wait for user to submit recipe via graphql
    //upload to cloudinary
    //wait for link from cloudinary
    //save recipe with cloudinary link

    return res.status(200).send('Upload complete');
  })

  //Express port
  app.listen(4000, "0.0.0.0"), () => {
    console.log("Express Server started on localhost:4000")
  };
};

main().catch((err) => {
  console.log(err);
});