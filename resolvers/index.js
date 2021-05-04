import GraphQLDateTime from "graphql-iso-date";
import userResolvers from "./user.js";
import contestResolvers from "./contest.js";
import hostingResolvers from "./hosting.js";
import precontestResolvers from "./precontest.js";
import miscResolvers from "./misc.js";

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  userResolvers,
  contestResolvers,
  hostingResolvers,
  precontestResolvers,
  // miscResolvers,
  // blogResolvers,
  customDateScalarResolver,
];
