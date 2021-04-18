import jwt from "jsonwebtoken";
import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { users } from "../../database/utils/injector.js";

export const getUser = async (req) => {
  try {
    req.userId = null;
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (payload.userId) {
        req.userId = payload.userId;
      }
      // const user = await users.findOne({ _id: ObjectID(payload.userId) });
      // if (user) {
      //   req.userId = user._id;
      // } else {
      //   throw new Error("user not found")
      // }
    }
  } catch (error) {
    throw error;
  }
};
