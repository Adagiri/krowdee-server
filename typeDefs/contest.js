import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    contests: [Contest!]
  }

  extend type Mutation {
    addContestQuestion(input: addContestQuestionInput): Boolean!
    updateContestQuestion(input: updateContestQuestionInput): Boolean!
    deleteContestQuestion(input: deleteContestQuestionInput): Boolean!
    deleteContest(input: deleteContestInput): Boolean!
  }

  input addContestQuestionInput {
    _id: Int
    name: String
    num: Int!
    text: String!
    banner: String
    opts: [OptionInput!]
  }

  input updateContestQuestionInput {
    _id: Int!
    name: String
    num: Int!
    text: String
    banner: String
    opts: [OptionInput!]
  }

  input deleteContestQuestionInput {
    _id: Int!
    num: Int!
  }

  input deleteContestInput {
    _id: Int!
  }

  input OptionInput {
    lt: String!
    text: String!
  }

  type Contest {
    _id: Int!
    name: String!
    crat: String!
    upat: String!
    questions: [Question!]!
  }

  type Question {
    num: Int!
    text: String!
    banner: String
    opts: [Option!]!
  }

  type Option {
    lt: String!
    text: String!
  }
`;
