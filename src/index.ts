import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import fileUpload from 'express-fileupload';
import session from "express-session";
import fs from 'fs';
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
import { handleImageUpload } from './utils/imageUploader';
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
      stepLoader: StepsLoader()
    })
  });

  await apolloServer.start();
  //Listen to GraphQL via express server
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.post('/image-upload/:uuid', async (req, res) => {
    try {
      if (!req.files) {
        return res.send({
          status: false,
          message: "There was no file found in request",
          payload: {},
        });
      } else {
        const uuid = req.params.uuid;
        console.log(uuid);

        let file: any = req.files.file;
        let fileName = file.name;
        let filePath = `${process.cwd()}/tempImg/${fileName}`;

        //Save image to local disk
        await fs.writeFile(filePath, file.data, () => {
          console.log("Local Save");
        });

        let imgUrl = "no-update";
        //upload logic
        if (uuid !== "no-update") {
          imgUrl = await handleImageUpload(filePath);
          console.log(imgUrl);
        }

        await redis.set(IMAGE_UPLOAD_PREFIX + uuid, imgUrl, 'ex', 1000 * 60 * 5);
        console.log(IMAGE_UPLOAD_PREFIX + uuid);


        return res.send({
          status: true,
          message: "File was uploaded successfuly",
          payload: {
            name: file.name,
            mimetype: file.mimetype,
            size: file.size,
          },
        })

      }
    } catch (err) {
      console.log(err);

      return res.status(500).send({
        status: false,
        message: "Unexpected problem",
        payload: {},
      });
    }

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