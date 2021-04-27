import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
// import { users } from "../database/utils/injector.js";
import { getSignedUrl } from "../aws/index.js";

export default {
  Query: {
    getSignedUrl: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { key } = input;
        try {
          return getSignedUrl(key);
        } catch (error) {
          throw error;
        }
      }
    ),
  },

  Mutation: {
    sendMessage: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, message, name } = input;
        try {
          const message = {
            message,
            time: new Date(),
            name,
            _id: ObjectID(_id),
          };
          const chat = await chats.findOne({ _id: ObjectID(_id) });

          if (!chat) {
            throw new Error("discussion not found");
          }
          const discussion = await chats.updateOne(
            { _id: ObjectID(_id) },
            { $push: { messages: message } }
          );
          console.log(discussion);
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
