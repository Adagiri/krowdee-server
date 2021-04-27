import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    contests: [Contest!]
  }

  extend type Mutation {
    addQuestion(input: addQuestionInput): Boolean!
    editQuestion(input: editQuestionInput): Boolean!
    deleteQuestion(input: deleteQuestionInput): Boolean!
    deleteContest(input: deleteContestInput): Boolean!
    hostContest(input: hostContestInput): HostedContest!
  }

  input hostContestInput {
    host: ID!
    status: String!
    veteran: Boolean!
    discussion: Boolean!
    alerts: [Alert!]
    name: String!
    summary: String
    banner: String
    show: String!
    categories: [String!]
    tags: [String!]
    mode: String!
    time: Int
    tasks: [Task!]!
    limit: Int!
    start: String!
    clients: [Client!]
    chats: ID!
    banned: [ID!]
  }

  input addQuestionInput {
    _id: Int
    name: String
    num: Int!
    text: String!
    banner: String
    opts: [OptionInput!]
    valid: String!
  }

  input editQuestionInput {
    _id: Int!
    name: String
    num: Int!
    text: String
    banner: String
    opts: [OptionInput!]
    valid: String
  }

  input deleteQuestionInput {
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
    upat: String!
    questions: [Question!]!
  }

  type Question {
    num: Int!
    text: String!
    banner: String
    opts: [Option!]!
    valid: String!
  }

  type Option {
    lt: String!
    text: String!
  }

  type HostedContest {
    host: User!
    status: String!
    veteran: Boolean!
    chat: Boolean!
    alerts: [Alert!]
    name: String!
    summary: String
    banner: String
    show: String!
    categories: [String!]
    tags: [String!]
    mode: String!
    time: Int!
    tasks: [Task!]!
    limit: Int!
    start: String!
    clients: [Client!]
    chats: ID
    banned: [ID!]
  }

  type Alert {
    message: String!
    time: String! 
  }

  type Client {
    _id: ID!
    name: String!
    avatar: String
    rank: Int!
    score: Int!
    tasks: [ClientTasks!]
  }

  type ClientTasks {
    num: Int!
    opt: String
  }

  type Task {
    num: Int!
    text: String!
    banner: String
    opts: [Option!]!
    time: Int
  }
`;
