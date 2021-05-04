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
    solveTask: async (_, { input }) => {
      const { _id, num, valid, userId } = input;
      try {
        const contest = await hosted.findOne({ _id: ObjectID(_id) });
        const task = { num: question, opt: valid };
        const question = contest.questions.filter(
          (question) => (question.num = num)
        );
        const questValid = question[0].valid;
        if (question[0].valid === valid) {
          //increase the persons score and change his doc
          //contest, participants, participant
          hosted.updateOne(
            { _id: ObjectID(_id), "participants._id": ObjectID(userId) },
            {
              $inc: { "contests.$.score": 2 },
              $push: { "contests.$.tasks": task },
            }
          );
        } else {
          hosted.updateOne(
            { _id: ObjectID(_id), "participants._id": ObjectID(userId) },
            {
              $push: { "contests.$.tasks": task },
            }
          );                                      
        }

        return {
          userValid: valid,
          valid: questValid,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};
