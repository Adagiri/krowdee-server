import mongodb from "mongodb";

const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, verifyObjectId } from "./middleware/index.js";
import { users } from "../database/utils/injector.js";

export default {
  Query: {
    fetchUser: combineResolvers(isAuthenticated, async (_, __, { userId }) => {
      const user = await users.findOne({ _id: ObjectID(userId) });
      if (!user) {
        throw new Error("user not found");
      } else {
        return user;
      }
    }),
  },

  Mutation: {
    editProfile: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        try {
          const user = await users.updateOne(
            { _id: ObjectID(userId) },
            { $set: { ...input } }
          );
          if (user.result.ok === 1) {
            return true;
          }
          return false;
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
