import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { isAuthenticated } from "./middleware/index.js";
import { db } from "../startups/db.js";

export default {
  Query: {
    getUser: combineResolvers(isAuthenticated, async (_, __, { userId }) => {
      const user = await db
        .collection("users")
        .findOne({ _id: ObjectID(userId) });
      if (!user) {
        throw new Error("user not found");
      } else {
        return user;
      }
    }),
  },

  Mutation: {
    loginWithSocial: async (_, { input }, { res }) => {
      const { providerId, sid } = input;
      try {
        const user = await db.collection("users").findOne({ providerId, sid });
        const _id = ObjectID();
        console.log(user);
        //create token to send
        let token = await jwt.sign(
          { userId: user ? user._id : _id },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        //attach cookie to response
        res.cookie("krowdeetoken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        //if user exist, return user lest create user and return
        if (user) {
          return {
            code: "200",
            success: true,
            message: "login successful",
            user,
            token,
          };
        } else {
          const createUser = await db
            .collection("users")
            .insertOne({ ...input, _id });

          if (createUser.insertedCount === 1 && createUser.result.ok === 1) {
            return {
              code: "200",
              success: true,
              message: "login successful",
              user: { ...input, _id  },
              token,
            };
          }
          console.log(createUser);
        }
      } catch (error) {
        throw error;
      }
    },
    editProfile: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        try {
          const user = await db
            .collection("users")
            .updateOne({ _id: ObjectID(userId) }, { $set: { ...input } });
          if (user.result.ok === 1) {
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
