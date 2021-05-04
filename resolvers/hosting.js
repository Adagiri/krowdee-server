import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
import canUserHostGlobal from "../utils/canUserHostGlobal.js";
import {
  users,
  discussions,
  closed,
  open,
  notifications,
} from "../database/utils/injector.js";

export default {
  Query: {},

  Mutation: {
    hostPrivateSearchPin: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { pin } = input;
        try {
          const contest = await closed.findOne({ pin });
          if (contest) {
            throw new Error("pin already taken");
          }
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    hostPrivate: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { pin, start } = input;
        const _id = ObjectID();
        let result = false;
        try {
          //CHECK IF PIN IS NOT TAKEN AT HOSTING TIME
          const contest = await closed.findOne({ pin });
          if (contest) {
            throw new Error("pin already taken");
          }
          //HOST THE CLOSED CONTEST, OPEN DISCUSSION & UPDATE USER DOC
          const promises = [
            closed.insertOne({
              _id,
              ...input,
              host: { ...input.host, _id: ObjectID(userId) },
              discussion: true
            }),
            discussions.insertOne({ contestId: _id, start }),
            users.updateOne(
              { _id: ObjectID(userId) },
              { $push: { closed: _id } }
            ),
          ];
          await Promise.all(promises).then((data) => {
            const ok = data.filter((content) => content.result.ok === 1);
            if (ok.length === 3) {
              result = true;
            }
          });
          return result;
        } catch (error) {
          throw error;
        }
      }
    ),

    hostGlobal: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { start } = input;
        const _id = ObjectID();

        try {
          //CONFIRM RANK OF THE USER & CONFIRM THAT HE HAS PRIVILEDGES
          const user = await users.findOne({ _id: ObjectID(userId) });
          const { pts, hosted } = user;

          const permit = canUserHostGlobal(pts, hosted);

          if (permit.status === false) {
            throw new Error(permit.message);
          } else {
            const promises = [
              open.insertOne({
                _id,
                ...input,
                host: { ...input.host, _id: ObjectID(userId) },
                ranked: false,
                discussion: true
              }),
              discussions.insertOne({ contestId: _id, start }),
              users.updateOne(
                { _id: ObjectID(userId) },
                { $push: { hosted: _id }, $inc: { hostedCount: 1 } }
              ),
            ];
            // HOST THE GLOBAL CONTEST, OPEN DISCUSSION & UPDATE USER DOC
            await Promise.all(promises);
            return true;
          }
        } catch (error) {
          throw error;
        }
      }
    ),

    refreshHost: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { contestId, type, ...host } = input;
        try {
          if (type === "global") {
            await open.updateOne(
              { _id: ObjectID(contestId) },
              { $set: { host: { ...host, _id: ObjectID(userId) } } }
            );
          } else {
            await closed.updateOne(
              { _id: ObjectID(contestId) },
              { $set: { host: { ...host, _id: ObjectID(userId) } } }
            );
          }

          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    unHost: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { type, name, _id, reason } = input;

        let collection = closed;
        try {
          if (type === "global") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest not found");
          }
          //CHECK IF THE USER HOSTED IT
          if (contest.host._id.toString() !== userId) {
            throw new Error("You didn't host this contest");
          } else if (contest.start < new Date()) {
            throw new Error("Contest already started");
          } else {
            if (!contest.participants || contest.participants.length === 0) {
              const promises = [
                users.updateOne(
                  { _id: ObjectID(userId) },
                  {
                    $pull: { closed: ObjectID(_id), hosted: ObjectID(_id) },
                    $inc: { hostedCount: type === "global" ? -1 : 0 },
                  }
                ),
                collection.deleteOne({ _id: ObjectID(_id) }),
              ];
              await Promise.all(promises);
            } else {
              const participants = contest.participants.map(
                (participant) => participant._id
              );
              // HOST THE GLOBAL CONTEST, OPEN DISCUSSION & UPDATE USER DOC
              const promises = [
                users.updateOne(
                  { _id: ObjectID(userId) },
                  {
                    $pull: { closed: ObjectID(_id), hosted: ObjectID(_id) },
                    $inc: { hostedCount: type === "global" ? -1 : 0 },
                  }
                ),
                notifications.insertOne({
                  to: participants,
                  message: reason
                    ? `${name} was cancelled because ${reason}`
                    : `${name} was cancelled`,
                  ref: null,
                  date: new Date(),
                }),

                users.updateMany(
                  { _id: { $in: participants } },
                  { $inc: { notify: 1 }, $pull: { waiting: ObjectID(_id) } }
                ),

                collection.deleteOne({ _id: ObjectID(_id) }),
              ];

              await Promise.all(promises);
          
            }
          }

          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
