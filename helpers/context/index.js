import jwt from "jsonwebtoken";

import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

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
    }
  } catch (error) {
    throw error;
  }
};
