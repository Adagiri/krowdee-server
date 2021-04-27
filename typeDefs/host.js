import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
  
  }

  extend type Mutation {
    host(input: hostInput): Boolean!
    sendAlert(sendAlertInput: String!): Boolean!
    kickOut(input: kickOutInput): Boolean!
    toggleChat(input: {_id: ID!}): Boolean!
    unHost(input: {_id: ID!}): Boolean!
    joinContest(input: joinContestInput): Boolean!
    leaveContest(input: {_id: ID!}): Boolean!
    joinWithPin(input: joinWithPinInput): Boolean!
    searchPin(input: {pin: Int}): Boolean!
    solveTask(input: solveTaskInput): TaskResult!
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

  type TaskResult {
      correct: Boolean!
      correctOption: String!
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
