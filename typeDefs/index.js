import { gql } from "apollo-server-express";
import userTypeDefs from "./user.js";
import contestTypeDefs from "./contest.js";
import hostingTypeDefs from "./hosting.js";
import precontestTypeDefs from "./precontest.js";
import contestLiveTypeDefs from "./contestLive.js";
import miscTypeDefs from "./misc.js";

const typeDefs = gql`
  scalar Date

  type Query {
    _: Int
  }

  type Mutation {
    _: Int
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }
`;

export default [
  typeDefs,
  userTypeDefs,
  hostingTypeDefs,
  precontestTypeDefs,
  contestLiveTypeDefs,
  miscTypeDefs,
  contestTypeDefs,
];
