import { gql } from "apollo-server-express";
import userTypeDefs from "./user.js";
import contestTypeDefs from "./contest.js";
import hostingTypeDefs from "./hosting.js";
import precontestTypeDefs from "./precontest.js";
// import miscTypeDefs from "./misc.js";
// import blogTypeDefs from "./blog.js";

const typeDefs = gql`
  scalar Date

  type Query {
    _: Int
  }

  type Mutation {
    _: Int
  }
`;

export default [
  typeDefs,
  userTypeDefs,
  hostingTypeDefs,
  precontestTypeDefs,
  // miscTypeDefs,
  // blogTypeDefs,
  contestTypeDefs,
];
