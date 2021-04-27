import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
import { users } from "../database/utils/injector.js";

export default {
  Query: {},

  Mutation: {
    addQuestion: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, name, num, text, opts, banner } = input;
        const contestId = Math.floor(Math.random() * 100000);
        let result = false;
        try {
          if (!_id) {
            //if _id is null, add a new contest to the contests collection
            const contest = await users.updateOne(
              { _id: ObjectID(userId) },
              {
                $push: {
                  contests: {
                    name,
                    _id: contestId,
                    questions: [{ num, text, banner, opts }],
                    crat: new Date(),
                  },
                },
              }
            );

            if (contest.result.ok === 1) {
              result = true;
            }
          } else {
            //if _id exists => contest exists, add to that contest questions array
            const contest = await users.updateOne(
              { _id: ObjectID(userId), "contests._id": _id },
              {
                $push: {
                  "contests.$.questions": { num, text, banner, opts },
                },
                $set: {
                  "contests.$.upat": new Date(),
                },
              }
            );
            if (contest.result.ok === 1) {
              result = true;
            }
          }
          return result;
        } catch (error) {
          throw error;
        }
      }
    ),
    editQuestion: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, num, name, ...rest } = input;
        try {
          const contest = await users.updateOne(
            {
              _id: ObjectID(userId),
              contests: {
                $elemMatch: {
                  _id, //this is level one select
                  "questions.num": num, // this is level to select
                },
              },
            },
            {
              $set: {
                "contests.$[outer].questions.num": { ...rest },
                "contests.$[outer].name": name,
              },
            },
            {
              arrayFilters: [{ "outer._id": _id }, { "inner.num": num }],
            }
          );

          if (contest.result.ok === 1) {
            return true;
          }

          return false;
        } catch (error) {}
      }
    ),
    deleteQuestion: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, num } = input;
        try {
          const contest = await users.updateOne(
            { _id: ObjectID(userId), "contests._id": _id },
            {
              $pull: {
                "contests.$.questions": { num },
              },
              $set: {
                "contests.$.upat": new Date(),
              },
            }
          );

          if (contest.result.ok === 1) {
            return true;
          }

          return false;
        } catch (error) {
          throw error;
        }
      }
    ),
    deleteContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id } = input;
        try {
          const contest = await users.updateOne(
            { _id: ObjectID(userId) },
            {
              $pull: {
                contests: { _id },
              },
            }
          );

          console.log(contest)
          if (contest.result.ok === 1) {
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
