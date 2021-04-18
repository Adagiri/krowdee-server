import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated} from "./middleware/index.js";
// import { users } from "../database/utils/injector.js";
import { getSignedUrl } from "../aws/index.js";

export default {
  Query: {
    getSignedUrl: combineResolvers(isAuthenticated, async (_, { input }, {userId}) => {
      const { key } = input;
     try {
         return getSignedUrl(key)
     } catch (error) {
         throw error;
     }
    }),
  },

  Mutation: {

  },
};
