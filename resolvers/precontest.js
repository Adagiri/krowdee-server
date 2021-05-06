import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
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
    joinClosed: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { pin, name, avatar } = input;
        //CHECK IF YOU ALREADY JOINED
        try {
          const contest = await closed.findOne({ pin });
          if (!contest) {
            throw new Error("contest does not exist");
          } else {
            let { joined, limit, _id, participants, banned } = contest;

            if (
              participants &&
              participants.find(
                (participant) => participant._id.toString() === userId
              )
            ) {
              throw new Error("you already joined this contest");
            } else if (banned && banned.find((_id) => ObjectID(userId))) {
              throw new Error("you were banned from this contest");
            } else if (joined >= limit) {
              throw new Error("filled up already");
            } else {
              const promises = [
                closed.updateOne(
                  { _id: ObjectID(_id) },
                  {
                    $push: {
                      participants: {
                        _id: ObjectID(userId),
                        name,
                        avatar,
                        score: 0,
                      },
                    },
                    $inc: { joined: 1 },
                  }
                ),
                users.updateOne(
                  { _id: ObjectID(userId) },
                  {
                    $push: { waiting: { _id: ObjectID(_id), type: "closed" } },
                  }
                ),
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
    joinOpen: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, name, avatar } = input;
        //CHECK IF USER ALREADY JOINED
        try {
          const contest = await open.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest does not exist");
          } else {
            let { joined, limit, participants, banned, host } = contest;
            // if (host._id.toString() === userId) {
            //   throw new Error("You cannot join your own contest");
            // } else
            if (
              participants &&
              participants.find(
                (participant) => participant._id.toString() === userId
              )
            ) {
              throw new Error("you already joined this contest");
            } else if (banned && banned.find((_id) => ObjectID(userId))) {
              throw new Error("you were banned from this contest");
            } else if (joined >= limit) {
              throw new Error("filled up already");
            } else {
              const promises = [
                open.updateOne(
                  { _id: ObjectID(_id) },
                  {
                    $push: {
                      participants: {
                        _id: ObjectID(userId),
                        name,
                        avatar,
                        score: 0,
                      },
                    },
                    $inc: { joined: 1 },
                  }
                ),
                users.updateOne(
                  { _id: ObjectID(userId) },
                  {
                    $push: { waiting: { _id: ObjectID(_id), type: "open" } },
                  }
                ),
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

    leaveContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, type } = input;
        let collection = closed;
        try {
          if (type === "open") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          //CHECK IF CONTEST EXISTS
          if (!contest) {
            throw new Error("contest does not exist");
          }
          //CHECK IF USER JOINED ALREADY
          const { participants } = contest;
          if (
            !participants.find(
              (participant) => participant._id.toString() === userId
            )
          ) {
            throw new Error("you didn't join this contest before");
          }

          const promises = [
            collection.updateOne(
              { _id: ObjectID(_id) },
              {
                $pull: { participants: { _id: ObjectID(userId) } },
                $inc: { joined: -1 },
              }
            ),
            users.updateOne(
              { _id: ObjectID(userId) },
              {
                $pull: { waiting: { _id: ObjectID(_id) } },
              }
            ),
          ];

          await Promise.all(promises);

          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    kickOut: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, reason, contestName, participantId, type } = input;
        let collection = closed;
        try {
          if (type === "open") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest does not exist");
          }

          const { banned } = contest;
          if (
            banned &&
            banned.find((_id) => _id.toString() === participantId)
          ) {
            throw new Error("you banned this fellow already");
          }
          const promises = [
            collection.updateOne(
              { _id: ObjectID(_id) },
              {
                $pull: { participants: { _id: ObjectID(participantId) } },
                $inc: { joined: -1 },
                $push: { banned: ObjectID(participantId) },
              }
            ),
            notifications.insertOne({
              to: ObjectID(participantId),
              message: reason
                ? `you were kicked out of ${contestName} because ${reason}`
                : `you were kicked out of ${contestName}`,
              ref: ObjectID(_id),
              date: new Date(),
            }),
            users.updateOne(
              { _id: ObjectID(participantId) },
              { $inc: { notify: 1 }, $pull: {waiting: {_id : ObjectID(_id)}} }
            ),
          ];
          await Promise.all(promises);
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    sendAnnouncement: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, message, type } = input;
        let collection = closed;
        try {
          if (type === "open") {
            collection = open;
          }
          await collection.updateOne(
            { _id: ObjectID(_id) },
            { $push: { announcements: message, date: new Date() } }
          );
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    toggleDiscussion: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, type, name } = input;
        let collection = closed;

        try {
          if (type === "open") {
            collection = open;
          }
          const contest = await collection.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest not found");
          }
          //ADD A MESSAGE TO THE DISCUSSION SIGNIFYING THE LOCK/UNLOCK
          const message = {
            message: contest.discussion
              ? `${name} locked the discussion`
              : `${name} unlocked the discussion`,
            date: new Date(),
            admin: true,
            _id: ObjectID(userId),
            name,
          };
          const promises = [
            collection.updateOne(
              { _id: ObjectID(_id) },
              { $set: { discussion: !contest.discussion } }
            ),
            discussions.updateOne(
              { contestId: ObjectID(_id) },
              { $push: { messages: message } }
            ),
          ];
          await Promise.all(promises);

          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
