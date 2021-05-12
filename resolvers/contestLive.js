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
import { NoFragmentCyclesRule } from "graphql";

export default {
  Query: {
    getDiscussions: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, cursor, limit = 5 } = input;
        try {
          //fetch discussions
          const discuss = await discussions.findOne({
            contestId: ObjectID(_id),
          });
          if (!discuss) {
            throw new Error("discussion not found");
          }

          let discussion = await discussions
            .aggregate([
              {
                $match: {
                  contestId: ObjectID(_id),
                },
              },
              {
                $unwind: {
                  path: "$messages",
                },
              },
              {
                $match: {
                  "messages._id": { $lt: ObjectID(cursor) },
                },
              },
              {
                $sort: {
                  "messages._id": -1,
                },
              },

              {
                $limit: limit + 1,
              },
              {
                $project: {
                  _id: 0,
                  messages: 1,
                },
              },
            ])
            .toArray();

          console.log(discussion.map((elem) => elem.messages));

          const hasNextPage = discussion.length > limit;
          discussion = hasNextPage ? discussion.slice(0, -1) : discussion;

          // return discuss
          return {
            discussion: {
              ...discuss,
              messages: discussion.map((elem) => elem.messages),
            },
            pageInfo: {
              nextPageCursor: hasNextPage
                ? discussion.map((elem) => elem.messages)[discussion.length - 1]
                    ._id
                : null,
              hasNextPage,
            },
          };
        } catch (error) {
          throw error;
        }
      }
    ),

    getOpenContests: async (_, { input }, { userId }) => {
      const { limit = 2, cursor = 2, ...rest } = input;
      const params = {};
      for (let key in rest) {
        if (rest[key] === null) {
          return;
        }
        params[key] = rest[key];
      }

      try {
        //SORT BY JOINED
        //ONLY ONCE THAT HAVE NOT STARTED
        const contests = await open
          .find({ ...params })
          .limit(limit * cursor)
          .sort({ joined: -1 })
          .toArray();
        return contests;
      } catch (error) {
        throw error;
      }
    },
    getRecords: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { ccs, ops } = input;
      
        try {
          const closedContest =
            ccs.length > 0
              ? await closed.find({ _id: { $in: ccs.map(obj => ObjectID(obj)) } }).toArray()
              : [];

          const openContest =
            ops.length > 0
              ? await open.find({ _id: { $in: ops.map(obj => ObjectID(obj)) } }).toArray()
              : [];
console.log(openContest)
          return [...openContest, ...closedContest];
        } catch (error) {
          throw error;
        }
      }
    ),
    getContest: combineResolvers(isAuthenticated, async(_, { input }, {userId})=> {
const { type, _id } = input;
let collection = closed
      try {
        if (type === "open") {
          collection = open
        }
        const contest = await collection.findOne({_id: ObjectID(_id)})
        if (!contest) {
          throw new Error("Contest not found")
        }
        return contest;
      } catch (error) {
        throw error
      }
    }),
    getCorrect: combineResolvers(isAuthenticated, async(_, { input }, {userId})=> {
      const { type, _id } = input;
      let collection = closed
            try {
              if (type === "open") {
                collection = open
              }
              const contest = await collection.findOne({_id: ObjectID(_id)})
              if (!contest) {
                throw new Error("Contest not found")
              }
              return contest.valids;
            } catch (error) {
              throw error
            }
          })
  },

  Mutation: {
    solveTask: async (_, { input }, { userId }) => {
      const { _id, type, num, valid } = input;
      let collection = closed;
      //CATEGORY UPDATE IN USER COLLECTION DOC
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
          category,
          level,
        } = contest;
        let pts = level === "bgn" ? 1 : level === "itm" ? 2 : 3;

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
        //CHECK IF USER ALREADY ANSWERED THAT QUESTION OR QUESTION IS PASSED
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
        let catz = "catz." + category;

        if (ranked) {
          await Promise.all([
            collection.updateOne(
              { _id: ObjectID(_id), "participants._id": ObjectID(userId) },
              {
                $push: { "participants.$.tasks": { num, opt: valid } },
                $inc:
                  validOption.v === valid
                    ? { "participants.$.score": pts }
                    : { "participants.$.score": 0 },
              }
            ),
            users.updateOne(
              { _id: ObjectID(userId) },
              { $inc: { pts: pts, [catz]: pts } }
            ),
          ]);
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
    sendMessage: async (_, { input }, { userId }) => {
      const { _id, message, name, type } = input;
      let collection = closed;
      try {
        if (type === "open") {
          collection = open;
        }
        const contest = await collection.findOne({ _id: ObjectID(_id) });
        if (!contest) {
          throw new Error("Contest doesn't exist");
        } else if (
          !contest.participants.find(
            (participant) => participant._id.toString() === userId
          ) ||
          !contest.participants
        ) {
          throw new Error("you are not part of this contest");
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
                  userId: ObjectID(userId),
                  _id: ObjectID(),
                },
              },
            }
          );
        }
        return true;
      } catch (error) {
        throw error;
      }
    },

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
            throw new Error("contest doesn't exist");
          } else if (new Date().toISOString() < contest.start) {
            console.log(new Date().toISOString());
            console.log(contest.start);
            throw new Error("contest has not started");
          } else if (new Date().toISOString() > contest.end) {
            throw new Error("contest already ended");
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
          } else if (new Date().toISOString() < contest.end) {
            throw new Error("contest has not ended");
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
