import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./middleware/index.js";
import { users, discussions, closed } from "../database/utils/injector.js";

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

    hostPrivate: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { pin, start } = input;
        const _id = ObjectID();
        try {
          //CHECK IF PIN IS NOT TAKEN AT HOSTING TIME
          const contest = await closed.findOne({ pin });
          if (contest) {
            throw new Error("pin already taken");
          }
          //HOST THE CLOSED CONTEST, OPEN DISCUSSION & UPDATE USER DOC
          const promises = [
            closed.insertOne({
              host: ObjectID(userId),
              _id,
              ...input,
            }),
            discussions.insertOne({ contestId: _id, start }),
            users.updateOne(
              { _id: ObjectID(userId) },
              { $push: { closed: _id } }
            ),
          ];
          await Promise.all(promises).then((data) => {
            console.log("closedData", data);
          });
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    hostGlobal: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
     
        const _id = ObjectID();
        try {
          //CONFIRM RANK OF THE USER & CONFIRM THAT HE HAS PRIVILEDGES

          const user = await users.findOne({ _id: ObjectID(userId) });
          const { pts, hosted } = user;
          canUserHostGlobal(pts, hosted)
      
          // HOST THE GLOBAL CONTEST, OPEN DISCUSSION & UPDATE USER DOC
  
          // const promises = [
          //   closed.insertOne({
          //     host: ObjectID(userId),
          //     _id,
          //     ...input,
          //   }),
          //   discussions.insertOne({ contestId: _id, start }),
          //   users.updateOne(
          //     { _id: ObjectID(userId) },
          //     { $push: { hosted: _id } }
          //   ),
          // ];
          // await Promise.all(promises).then((data) => {
          //   console.log("closedData", data);
          // });
          // return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    refreshHost: combineResolvers(isAuthenticated, async (_, { input }) => {
      const { hostId, ...host } = input;
      try {
        await closed.updateOne({ _id: ObjectID(hostId) }, { $set: { host } });
        return true;
      } catch (error) {
        throw error;
      }
    }),
    // sendAlert: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id, message } = input;
    //     try {
    //       await closed.updateOne({ _id: ObjectID(_id) }, { alerts: message });
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),

    // kickOut: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id, clientId, reason, contestName } = input;

    //     try {
    //       const notification = {
    //         message: `you were kicked out of ${contestName}`,
    //         extra: {
    //           message: reason,
    //           ref: ObjectID(userId),
    //         },
    //       };

    //       const promises = [
    //         users.updateOne(
    //           { _id: ObjectID(clientId) },
    //           { $push: { notifications: notification } }
    //         ),
    //         closed.updateOne(
    //           { _id: ObjectID(_id) },
    //           {
    //             $pull: { clients: { "clients._id": clientId } },
    //             $push: { banned: clientId },
    //           }
    //         ),
    //       ];
    //       Promise.all(promises).then((data) => {
    //         console.log(error);
    //       });
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),
    // unHost: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id } = input;
    //     try {
    //       //check if the user closed it
    //       //if he did not throw error
    //       //if he did, delete it
    //       const contest = await closed.findOne({ _id: ObjectID(_id) });
    //       if (!contest) {
    //         throw new Error("contest not found");
    //       }
    //       if (!(contest.host === ObjectID(userId))) {
    //         throw new Error("You didnt host this contest");
    //       }
    //       const promises = [
    //         closed.deleteOne({ _id: ObjectID(_id) }),
    //         users.updateOne(
    //           { _id: ObjectID(userId) },
    //           { $pull: { _closed: ObjectID(_id) } }
    //         ),
    //       ];

    //       Promise.all(promises).then((data) => {
    //         console.log(data);
    //       });
    //       const deleted = await closed.deleteOne({ _id: ObjectID(_id) });
    //       console.log(deleted.result.ok);
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),

    // toggleChat: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id } = input;
    //     try {
    //       //check if the user closed it
    //       //if he did not throw error
    //       //if he did, delete it
    //       const contest = await closed.findOne({ _id: ObjectID(_id) });
    //       if (!contest) {
    //         throw new Error("contest not found");
    //       }
    //       if (!(contest.host === ObjectID(userId))) {
    //         throw new Error("You didn't host this contest");
    //       }
    //       const edited = await closed.updateOne(
    //         { _id: ObjectID(_id) },
    //         { $set: { chat: !contest.chat } }
    //       );
    //       console.log(edited.result.ok);
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),

    // joinPrivate: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { pin, name, avatar, clientId } = input;
    //     //check if you joined before
    //     //leave contest
    //     try {
    //       const contest = await closed.findOne({ pin });

    //       if (!contest) {
    //         throw new Error("contest does not exist");
    //       }
    //       if (
    //         contest.clients.filter((client) => client._id === ObjectID(userId))
    //       ) {
    //         throw new Error("you already joined this contest");
    //       }
    //       if (!(contest.joined < limit)) {
    //         throw new Error("filled up already");
    //       }

    //       const promises = [
    //         closed.updateOne(
    //           { _id: ObjectID(_id) },
    //           {
    //             $push: { clients: { _id: clientId, name, avatar } },
    //             $inc: { joined: 1 },
    //           }
    //         ),
    //         users.updateOne(
    //           { _id: ObjectID(userId) },
    //           {
    //             $push: { waiting: { _id: clientId, name, avatar } },
    //           }
    //         ),
    //       ];
    //       await Promise.all(promises).then((data) => {
    //         console.log(data);
    //       });
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),

    // joinGlobal: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id, name, avatar, clientId } = input;

    //     try {
    //       const contest = await closed.findOne({ _id: ObjectID(_id) });

    //       if (!contest) {
    //         throw new Error("contest does not exist");
    //       }
    //       if (contest.banned.filter((ban) => ban === ObjectID(userId))) {
    //         throw new Error("you were kicked out from this contest");
    //       }
    //       if (!(contest.joined < limit)) {
    //         throw new Error("filled up already");
    //       }
    //       const promises = [
    //         closed.updateOne(
    //           { _id: ObjectID(_id) },
    //           {
    //             $push: { clients: { _id: clientId, name, avatar } },
    //             $inc: { joined: 1 },
    //           }
    //         ),
    //         users.updateOne(
    //           { _id: ObjectID(userId) },
    //           {
    //             $push: { waiting: { _id: clientId, name, avatar } },
    //           }
    //         ),
    //       ];
    //       await Promise.all(promises).then((data) => {
    //         console.log(data);
    //       });
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),
    // leaveContest: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id } = input;
    //     //check if you joined before
    //     //leave contest
    //     try {
    //       const contest = await closed.findOne({ _id: ObjectID(_id) });

    //       if (!contest) {
    //         throw new Error("contest does not exist");
    //       }
    //       if (
    //         !contest.clients.filter((client) => client._id === ObjectID(userId))
    //       ) {
    //         throw new Error("you are not part of this contest");
    //       }

    //       const promises = [
    //         closed.updateOne(
    //           { _id: ObjectID(_id) },
    //           {
    //             $pull: { clients: { "clients._id": ObjectID(userId) } },
    //             $inc: { joined: -1 },
    //           }
    //         ),
    //         users.updateOne(
    //           { _id: ObjectID(userId) },
    //           {
    //             $pull: { waiting: ObjectID(_id) },
    //           }
    //         ),
    //       ];
    //       await Promise.all(promises).then((data) => {
    //         console.log(data);
    //       });
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),
    // leaveOngoingContest: combineResolvers(
    //   isAuthenticated,
    //   async (_, { input }, { userId }) => {
    //     const { _id } = input;
    //     //check if you joined before
    //     //leave contest
    //     try {
    //       const contest = await closed.findOne({ _id: ObjectID(_id) });

    //       if (!contest) {
    //         throw new Error("contest does not exist");
    //       }
    //       if (
    //         !contest.clients.filter((client) => client._id === ObjectID(userId))
    //       ) {
    //         throw new Error("you are not part of this contest");
    //       }

    //       const promises = [
    //         closed.updateOne(
    //           { _id: ObjectID(_id) },
    //           {
    //             $pull: { clients: { "clients._id": ObjectID(userId) } },
    //             $inc: { joined: -1 },
    //           }
    //         ),
    //         users.updateOne(
    //           { _id: ObjectID(userId) },
    //           {
    //             $pull: { participated: ObjectID(_id) },
    //           }
    //         ),
    //       ];
    //       await Promise.all(promises).then((data) => {
    //         console.log(data);
    //       });
    //       return true;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // ),

    // searchPin: combineResolvers(
    //     isAuthenticated,
    //     async (_, { input }, { userId }) => {
    //       const { pin } = input;
    //       try {
    //         const contest = await closed.findOne({ pin });
    //         if (contest) {
    //           throw new Error("pin already taken");
    //         }
    //         return true;
    //       } catch (error) {
    //         throw error;
    //       }
    //     }
    //   ),
    //   solveTask: combineResolvers(
    //     isAuthenticated,
    //     async (_, { input }, { userId }) => {
    //       const { _id } = input;
    //       try {
    //         const contest = await closed.findOne({ pin });
    //         if (contest) {
    //           throw new Error("pin already taken");
    //         }
    //         return true;
    //       } catch (error) {
    //         throw error;
    //       }
    //     }
    //   ),
  },
};
