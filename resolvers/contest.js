import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
import { users } from "../database/utils/injector.js";

export default {
  Query: {},

  Mutation: {
    addTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, name, num, text, opts, banner, valid } = input;
        //CREATE A RANDOM ID
        const contestId = Math.floor(Math.random() * 100000);
        let result = false;
        try {
          if (!_id) {
            //IF ID IS NULL, CREATE A NEW CONTEST
            const contest = await users.updateOne(
              { _id: ObjectID(userId) },
              {
                $push: {
                  contests: {
                    name,
                    _id: contestId,
                    tasks: [{ num, text, banner, opts, valid }],
                    upat: new Date(),
                  },
                },
              }
            );

            if (contest.result.ok === 1) {
              result = true;
            }
          } else {
            //IF ID ISN'T NULL, PUSH THE TASK TO THE CONTEST LIST OF TASKS
            const contest = await users.updateOne(
              { _id: ObjectID(userId), "contests._id": _id },
              {
                $push: {
                  "contests.$.tasks": { num, text, banner, opts },
                },
                $set: {
                  "contests.$.upat": new Date(),
                },
              }
            );
            console.log("NO");
            if (contest.result.ok === 1) {
              result = true;
            }
          }
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    editTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, num, name, ...rest } = input;
        let result = false;
        let obj = {};
        Object.keys(rest).forEach((elem) => {
          obj[`contests.$[outer].tasks.$[inner].${elem}`] = rest[elem];
        });

        try {
          const contest = await users.updateOne(
            {
              _id: ObjectID(userId),
              contests: {
                $elemMatch: {
                  _id, //this is level one select
                  "tasks.num": num, // this is level to select
                },
              },
            },
            {
              $set: {
                ...obj,
                "contests.$[outer].name": name,
                "contests.$[outer].upat": new Date(),
              },
            },
            {
              arrayFilters: [{ "outer._id": _id }, { "inner.num": num }],
            }
          );

          if (contest.result.ok === 1) {
            result = true;
          }

          return result;
        } catch (error) {
          throw error;
        }
      }
    ),
    deleteTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, num } = input;
        try {
          const contest = await users.updateOne(
            { _id: ObjectID(userId), "contests._id": _id },
            {
              $pull: {
                "contests.$.tasks": { num },
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
