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

const novice = 0
const amateur = 150
const senior = 400
const enthusaist = 700
const professional = 1500
const expert = 2000
const leader = 3500
const vecteran = 6000
const master = 10000
const knight = 20000
const marshal = 30000

export const canUserHostGlobal = (pts, hosted) => {
  //WE ARE TO CHECK FOR HOW MANY GLOBAL CONTEST HAVE BEEN HOSTED SINCE THE PREVIOUS MONDAY

  //CHECK FOR THE LAST MONDAY'S DATE
  const getPreviousMonday = (date = null) => {
    const prevMonday = date && new Date(date.valueOf()) || new Date()
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7)
    return prevMonday
  };

  //CHECK HOW MANY WAS HOSTED AFTER THE LAST MONDAY
  const totalRecentlyHosted = hosted.filter(host => host.getTimestamp() > getPreviousMonday()).length

  if (pts)

  return {
    status: true,
    message: "you can host ... more global contest for this week"
  }

  return {
    status: false,
    message: "you already hosted 5 contest this week which is your ranks' limit. participate in more global contests to rank up and unlock more perks"

  }
   

}