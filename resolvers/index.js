import GraphQLDateTime from "graphql-iso-date";
import userResolvers from "./user.js";
import contestResolvers from "./contest.js";
import miscResolvers from "./misc.js";

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  userResolvers,
  contestResolvers,
  // miscResolvers,
  // blogResolvers,
  customDateScalarResolver,
];
