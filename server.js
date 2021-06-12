import { ApolloServer } from "apollo-server-express";
import { getUser } from "./helpers/context/index.js";
import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";

//apollo server configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    await getUser(req);

    res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    return { userId: req.userId, res };
  },
  formatError: (error) => {
    console.log(error);
    return {
      message: error.message,
    };
  },
});
export default server;
