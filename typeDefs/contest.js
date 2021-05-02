import { gql } from "apollo-server-express";
//ADD Task
//EDIT Task
//DELETE Task
//DELETE TASKS
//HOST PRIVATE
//REQUEST HOST GLOBAL
//JOIN PRIVATE CONTEST (PIN)
//JOIN GLOBAL CONTEST (FROM THE PAGE)

// extend type Query {

// }

export default gql`
  extend type Query {
    getContest: Boolean!
  }
  extend type Mutation {
    addTask(input: addTaskInput): Boolean!
    editTask(input: editTaskInput): Boolean!
    deleteTask(input: deleteTaskInput): Boolean!
    deleteContest(input: deleteContestInput): Boolean!
    hostPrivate(input: hostPrivateInput): Boolean!
    hostGlobal(input: hostGlobalInput): Boolean!
    refreshHost(input: Host): Boolean!

  }

  input addTaskInput {
    _id: Int
    name: String
    num: Int!
    text: String!
    banner: String
    opts: OptionInput
    valid: String!
  }

  input editTaskInput {
    _id: Int!
    name: String
    num: Int!
    text: String
    banner: String
    opts: OptionInput
    valid: String
  }

  input deleteTaskInput {
    _id: Int!
    num: Int!
  }

  input deleteContestInput {
    _id: Int!
  }

  input OptionInput {
    a: String!
    b: String!
    c: String
    d: String
    e: String
  }

  input hostPrivateInput {
    host: Host!
    name: String!
    summary: String
    banner: String
    tags: [String!]
    mode: String!
    time: Int
    tasks: [HostTaskInput!]!
    totalTasks: Int!
    limit: Int!
    start: String!
    pin: Int!
    valids: [HostValids]
  }

  input Host {
    name: String!
    avatar: String
    _id: ID!
    hostId: ID
  }

  input HostTaskInput {
    num: Int!
    text: String!
    banner: String
    opts: HostOptionInput!
    time: String
  }

  input HostValids {
    i: Int!
    v: String!
  }

  input HostOptionInput {
    a: String!
    b: String!
    c: String
    d: String
    e: String
  }

  input hostGlobalInput {
    host: Host!
    name: String!
    summary: String
    banner: String
    tags: [String!]
    category: String!
    mode: String!
    time: Int
    tasks: [HostTaskInput!]!
    totalTasks: Int!
    limit: Int!
    start: String!
    valids: [HostValids]
  }

  type Contest {
    _id: Int!
    name: String!
    upat: String!
    Tasks: [Task!]!
  }

  type Task {
    num: Int!
    text: String!
    banner: String
    opts: Option
    valid: String!
  }

  type Option {
    a: String!
    b: String!
    c: String
    d: String
    e: String
  }
`;

// sendAlert(sendAlertInput: String!): Boolean!
// kickOut(input: kickOutInput): Boolean!
// toggleChat(input: {_id: ID!}): Boolean!
// unHost(input: {_id: ID!}): Boolean!
// leaveContest(input: {_id: ID!}): Boolean!
// searchPin(input: {pin: Int}): Boolean!

// type Alert {
//     message: String!
//     time: String!
//   }

//   type Client {
//     _id: ID!
//     name: String!
//     avatar: String
//     rank: Int!
//     score: Int!
//     tasks: [ClientTasks!]
//   }

//   type ClientTasks {
//     num: Int!
//     opt: String
//   }

//   type Task {
//     num: Int!
//     text: String!
//     banner: String
//     opts: [Option!]!
//     valid: String!
//     time: Int
//   }

//   type Client {
//     _id: ID!
//     name: String!
//     avatar: String
//     score: Int!
//     tasks: [ClientTasks!]
//   }

//   type ClientTasks {
//     num: Int!
//     opt: String
//   }

//   type Alert {
//     message: String!
//     time: String!
//   }
//   input kickOutInput {
//     _id: ID!
//     clientId: ID!
//     reason: String
//     contestName: String!
// }

// input sendAlertInput {
//     _id: ID!
//     message: String!
//       }

//   type Hosted {
//     _id: ID!
//     host: ID!
//     status: String!
//     veteran: Boolean!
//     chat: Boolean!
//     alerts: [Alert!]
//     name: String!
//     summary: String
//     banner: String
//     show: String!
//     categories: [String!]
//     tags: [String!]
//     mode: String!
//     time: Int!
//     tasks: [Task!]!
//     totalTasks: Int!
//     limit: Int!
//     joined: Int!
//     start: String!
//     clients: [Client!]
//     chats: ID!
//     banned: [ID!]
//   }

// input joinPrivateInput {
//     pin: Int!
//     name: String!
//     avatar: String
//     clientId: ID!
//   }

//   input joinGlobalInput {
//     _id: ID!
//     name: String!
//     avatar: String
//     clientId: ID!
//   }

// joinPrivate(input: joinPrivateInput): Boolean!
// joinGlobal(input: joinGlobalInput): Boolean!
// Host Globally
// report contest