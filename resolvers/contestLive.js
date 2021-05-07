import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
import {
  closed,
  discussions,
  open,
  users,
} from "../database/utils/injector.js";

export default {
  Query: {
    getDiscussions: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, cursor, limit = 50 } = input;
        try {
          //fetch discussions
          const discuss = await discussions.findOne({
            contestId: ObjectID(_id),
          });
          if (!discuss) {
            throw new Error("discussion not found");
          }

          const discussion = await discussions
            .aggregate([
              {
                $match: {
                  _id: ObjectID(_id),
                },
              },
              {
                $unwind: {
                  path: "$messages",
                },
              },
              {
                $sort: {
                  "messages.date": -1,
                },
              },

              {
                $limit: limit,
              },
              {
                $project: {
                  _id: 0,
                  messages: 1,
                },
              },
            ])
            .toArray();

          const hasNextPage = discussion.length > limit;
          discussion = hasNextPage ? discussion.slice(0, -1) : discussion;

          // return discuss
          return {
            discussion: { ...discuss, messages: discussion },
            pageInfo: {
              nextPageCursor: hasNextPage
                ? discussion[discussion.length - 1].date
                : null,
              hasNextPage,
            },
          };
        } catch (error) {
          throw error;
        }
      }
    ),
  },

  Mutation: {
    solveTask: async (_, { input }, { userId }) => {
      const { _id, type, num, valid } = input;
      let collection = closed;
      try {
        if (type === "open") {
          collection = open;
        }
        const contest = await collection.findOne({ _id: ObjectID(_id) });
        if (!contest) {
          throw new Error("contest doesn't exist");
        }
        const {
          end,
          valids,
          ranked,
          start,
          totalTasks,
          tasks,
          participants,
        } = contest;
        let pts =
          ranked === "false"
            ? 0
            : ranked === "bgn"
            ? 1
            : ranked === "itm"
            ? 2
            : 3;

        if (
          !participants ||
          !participants.find(
            (participant) => participant._id.toString() === userId
          )
        ) {
          throw new Error("you are not part of this contest");
        }
        if (new Date() <= start) {
          throw new Error("contest has not started");
        }
        if (new Date() >= end) {
          throw new Error("contest already ended");
        }
        console.log(
          participants.find(
            (participant) => participant._id.toString() === userId
          )
        );

        let iop =
          participants &&
          participants.find(
            (participant) => participant._id.toString() === userId
          );

        if (iop && iop.tasks.find((task) => task.num === num)) {
          throw new Error("you are already past this question");
        }
        const validOption = valids.find((valid) => valid.i === num);

        let next = totalTasks <= num ? null : tasks[num];

        if (ranked !== "false") {
          await Promise.all(
           [ collection.updateOne(
              { _id: ObjectID(_id), "participants._id": ObjectID(userId) },
              {
                $push: { "participants.$.tasks": { num, opt: valid } },
                $inc:
                  validOption.v === valid
                    ? { "participants.$.score": pts }
                    : { "participants.$.score": 0 },
              }
            ),
            users.updateOne({ _id: ObjectID(userId) }, { $inc: { pts: pts } })]
          );
        } else {
          await collection.updateOne(
            { _id: ObjectID(_id), "participants._id": ObjectID(userId) },
            {
              $push: { "participants.$.tasks": { num, opt: valid } },
              $inc:
                validOption.v === valid
                  ? { "participants.$.score": pts }
                  : { "participants.$.score": 0 },
            }
          );
        }
        return {
          userValid: valid,
          valid: validOption.v,
          next,
        };
      } catch (error) {
        throw error;
      }
    },
    sendMessage: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, message, name, type } = input;
        let collection = closed;
        try {
          if (type === "open") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("Contest doesn't exist");
          } else if (contest.discussion === false) {
            throw new Error("discussion is locked");
          } else {
            await discussions.updateOne(
              { contestId: ObjectID(_id) },
              {
                $push: {
                  messages: {
                    name,
                    message,
                    _id: ObjectID(userId),
                    date: new Date(),
                  },
                },
              }
            );
          }
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    startContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, type } = input;
        let collection = closed;
        try {
          if (type === "open") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("Contest doesn't exist");
          } else {
            await users.updateOne(
              { _id: ObjectID(userId) },
              {
                $push:
                  type === "open"
                    ? { open: ObjectID(_id) }
                    : { closed: ObjectID(_id) },
              }
            );
          }
          const nextTask = { next: contest.tasks[0] };
          return nextTask;
        } catch (error) {
          throw error;
        }
      }
    ),

    endContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, type } = input;
        let collection = closed;
        try {
          if (type === "open") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("Contest doesn't exist");
          } else {
            await users.updateOne(
              { _id: ObjectID(userId) },
              {
                $pull: { joined: ObjectID(_id) },
              }
            );
          }

          return contest;
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
