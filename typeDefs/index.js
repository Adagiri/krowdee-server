import { gql } from "apollo-server-express";
import userTypeDefs from "./user.js";
import contestTypeDefs from "./contest.js";
import miscTypeDefs from "./misc.js";
import hostTypeDefs from "./host.js";

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
  miscTypeDefs,
  hostTypeDefs,
  contestTypeDefs,
];
