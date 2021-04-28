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
    host(input: hostInput): Boolean!
    sendAlert(sendAlertInput: String!): Boolean!
    kickOut(input: kickOutInput): Boolean!
    toggleChat(input: {_id: ID!}): Boolean!
    unHost(input: {_id: ID!}): Boolean!
    joinContest(input: joinContestInput): Boolean!
    leaveContest(input: {_id: ID!}): Boolean!
    joinWithPin(input: joinWithPinInput): Boolean!
    searchPin(input: {pin: Int}): Boolean!
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


  input joinWithPinInput {
    pin: Int!
    name: String!
    avatar: String
    clientId: ID!
  }

  input joinContestInput {
    _id: ID!
    name: String!
    avatar: String
    clientId: ID!
  }

  input sendAlertInput {
_id: ID!
message: String!
  }

  input hostInput {
    status: String!
    veteran: Boolean!
    chat: Boolean!
    name: String!
    summary: String
    banner: String
    show: String!
    categories: [String!]
    tags: [String!]
    mode: String!
    time: Int
    tasks: [Task!]!
    totalTasks: Int!
    limit: Int!
    start: String!
    pin: Int!
  }

 
  type Hosted {
    _id: ID!
    host: ID!
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
    totalTasks: Int!
    limit: Int!
    joined: Int!
    start: String!
    clients: [Client!]
    chats: ID!
    banned: [ID!]
  }

  type Task {
    num: Int!
    text: String!
    banner: String
    opts: [Option!]!
    valid: String!
    time: Int
  }


  type Client {
    _id: ID!
    name: String!
    avatar: String
    score: Int!
    tasks: [ClientTasks!]
  }

  type ClientTasks {
    num: Int!
    opt: String
  }

  type Alert {
    message: String!
    time: String! 
  }
  input kickOutInput {
    _id: ID!
    clientId: ID!
    reason: String
    contestName: String! 
}
`;
