import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
import { chats, hosted, users } from "../database/utils/injector.js";
// import { users } from "../database/utils/injector.js";

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
    host: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { pin, start } = input;
        try {
          const contest = await hosted.findOne({ pin });
          if (contest) {
            throw new Error("pin already taken");
          }
          const _id = ObjectID();
          const promises = [
            hosted.insertOne({
              host: ObjectID(userId),
              _id,
              ...input,
            }),
            chats.insertOne({ contestId: _id , start}),
            users.updateOne({ _id: ObjectID(userId) }, { hosted: _id }),
          ];
          await Promise.all(promises).then((data) => {
            console.log("hostedData", data);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    sendAlert: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, message } = input;
        try {
          await hosted.updateOne({ _id: ObjectID(_id) }, { alerts: message });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    kickOut: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, clientId, reason, contestName } = input;

        try {
          const notification = {
            message: `you were kicked out of ${contestName}`,
            extra: {
              message: reason,
              ref: ObjectID(userId),
            },
          };

          const promises = [
            users.updateOne(
              { _id: ObjectID(clientId) },
              { $push: { notifications: notification } }
            ),
            hosted.updateOne(
              { _id: ObjectID(_id) },
              {
                $pull: { clients: { "clients._id": clientId } },
                $push: { banned: clientId },
              }
            ),
          ];
          Promise.all(promises).then((data) => {
            console.log(error);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    unHost: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id } = input;
        try {
          //check if the user hosted it
          //if he did not throw error
          //if he did, delete it
          const contest = await hosted.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest not found");
          }
          if (!(contest.host === ObjectID(userId))) {
            throw new Error("You didnt host this contest");
          }
          const promises = [
            hosted.deleteOne({ _id: ObjectID(_id) }),
            users.updateOne(
              { _id: ObjectID(userId) },
              { $pull: { _hosted: ObjectID(_id) } }
            ),
          ];

          Promise.all(promises).then((data) => {
            console.log(data);
          });
          const deleted = await hosted.deleteOne({ _id: ObjectID(_id) });
          console.log(deleted.result.ok);
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    toggleChat: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id } = input;
        try {
          //check if the user hosted it
          //if he did not throw error
          //if he did, delete it
          const contest = await hosted.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest not found");
          }
          if (!(contest.host === ObjectID(userId))) {
            throw new Error("You didn't host this contest");
          }
          const edited = await hosted.updateOne(
            { _id: ObjectID(_id) },
            { $set: { chat: !contest.chat } }
          );
          console.log(edited.result.ok);
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    joinGlobalContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id, name, avatar, clientId } = input;

        try {
          const contest = await hosted.findOne({ _id: ObjectID(_id) });

          if (!contest) {
            throw new Error("contest does not exist");
          }
          if (contest.banned.filter((ban) => ban === ObjectID(userId))) {
            throw new Error("you were kicked out from this contest");
          }
          if (!(contest.joined < limit)) {
            throw new Error("filled up already");
          }
          const promises = [
            hosted.updateOne(
              { _id: ObjectID(_id) },
              {
                $push: { clients: { _id: clientId, name, avatar } },
                $inc: { joined: 1 },
              }
            ),
            users.updateOne(
              { _id: ObjectID(userId) },
              {
                $push: { waiting: { _id: clientId, name, avatar } },
              }
            ),
          ];
          await Promise.all(promises).then((data) => {
            console.log(data);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    leaveContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id } = input;
        //check if you joined before
        //leave contest
        try {
          const contest = await hosted.findOne({ _id: ObjectID(_id) });

          if (!contest) {
            throw new Error("contest does not exist");
          }
          if (
            !contest.clients.filter((client) => client._id === ObjectID(userId))
          ) {
            throw new Error("you are not part of this contest");
          }

          const promises = [
            hosted.updateOne(
              { _id: ObjectID(_id) },
              {
                $pull: { clients: { "clients._id": ObjectID(userId) } },
                $inc: { joined: -1 },
              }
            ),
            users.updateOne(
              { _id: ObjectID(userId) },
              {
                $pull: { waiting: ObjectID(_id) },
              }
            ),
          ];
          await Promise.all(promises).then((data) => {
            console.log(data);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    leaveOngoingContest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { _id } = input;
        //check if you joined before
        //leave contest
        try {
          const contest = await hosted.findOne({ _id: ObjectID(_id) });

          if (!contest) {
            throw new Error("contest does not exist");
          }
          if (
            !contest.clients.filter((client) => client._id === ObjectID(userId))
          ) {
            throw new Error("you are not part of this contest");
          }

          const promises = [
            hosted.updateOne(
              { _id: ObjectID(_id) },
              {
                $pull: { clients: { "clients._id": ObjectID(userId) } },
                $inc: { joined: -1 },
              }
            ),
            users.updateOne(
              { _id: ObjectID(userId) },
              {
                $pull: { participated: ObjectID(_id) },
              }
            ),
          ];
          await Promise.all(promises).then((data) => {
            console.log(data);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
    joinWithPin: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { pin, name, avatar, clientId } = input;
        //check if you joined before
        //leave contest
        try {
          const contest = await hosted.findOne({ pin });

          if (!contest) {
            throw new Error("contest does not exist");
          }
          if (
            contest.clients.filter((client) => client._id === ObjectID(userId))
          ) {
            throw new Error("you already joined this contest");
          }
          if (!(contest.joined < limit)) {
            throw new Error("filled up already");
          }

          const promises = [
            hosted.updateOne(
              { _id: ObjectID(_id) },
              {
                $push: { clients: { _id: clientId, name, avatar } },
                $inc: { joined: 1 },
              }
            ),
            users.updateOne(
              { _id: ObjectID(userId) },
              {
                $push: { waiting: { _id: clientId, name, avatar } },
              }
            ),
          ];
          await Promise.all(promises).then((data) => {
            console.log(data);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    searchPin: combineResolvers(
        isAuthenticated,
        async (_, { input }, { userId }) => {
          const { pin } = input;
          try {
            const contest = await hosted.findOne({ pin });
            if (contest) {
              throw new Error("pin already taken");
            }
            return true;
          } catch (error) {
            throw error;
          }
        }
      ),
      solveTask: combineResolvers(
        isAuthenticated,
        async (_, { input }, { userId }) => {
          const { _id } = input;
          try {
            const contest = await hosted.findOne({ pin });
            if (contest) {
              throw new Error("pin already taken");
            }
            return true;
          } catch (error) {
            throw error;
          }
        }
      ),
  },
};

//   sendMessage(input: sendMessageInput): Boolean!
//   solveTask(input: solveTaskInput): TaskResult!
