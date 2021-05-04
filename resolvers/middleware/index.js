import { skip } from "graphql-resolvers";
import mongodb from "mongodb";

const ObjectID = mongodb.ObjectID;

//Verify if a string is a valid OBjectId
export const verifyObjectId = (_id) => {
  if (ObjectID.isValid(_id)) {
    if (String(new ObjectID(_id)) === _id) {
      return true;
    }
    return false;
  }
  return false;
};

export const isAuthenticated = (_, __, { userId }) => {
  if (!userId) {
    throw new Error("Access denied, please login to continue");
  }

  return skip;
};

