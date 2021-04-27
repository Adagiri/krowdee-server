import { ApolloServer } from "apollo-server-express";
import { getUser } from "./helpers/context/index.js";
import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";


//apollo server configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // fetch userId from token in req header
    console.log("req",req)
    await getUser(req);
    console.log(req)
    return { userId: req.userId };
  },
  formatError: (error) => {
    console.log(error);
    return {
      message: error.message,
    };
  },
});

export default server;
