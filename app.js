import dotEnv from "dotenv";
dotEnv.config();
const PORT = process.env.PORT || 3000;

import express from "express";
import server from "./server.js";
import cors from "./startups/cors.js";
import db from "./startups/db.js";

const app = express();
app.use(express.json());
cors(app);
server.applyMiddleware({ app, path: "/graphql" });

db()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        "app listening on port: ",
        process.env.PORT,
        "with graphql @: ",
        server.graphqlPath
      );
    });
  })
  .catch((error) => console.log(error));
