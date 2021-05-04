import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    hostedContest: Boolean!
  }
  extend type Mutation {
    hostPrivateSearchPin(input: hostPrivateSearchPinInput): Boolean!
    hostPrivate(input: hostPrivateInput): Boolean!
    hostGlobal(input: hostGlobalInput): Boolean!
    refreshHost(input: refreshHostInput): Boolean!
    unHost(input: unHostInput): Boolean!
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

  input hostPrivateSearchPinInput {
    pin: Int!
  }

  input refreshHostInput {
    name: String!
    avatar: String
    contestId: ID!
    type: String!
  }

  input unHostInput {
    _id: ID!
    type: String!
    name: String!
    reason: String
  }
`;

//   type Hosted {
//     _id: ID!
//     host: ID!
//     status: String!
//     veteran: Boolean!
//     discussion: Boolean!
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
//     participants: [participant!]
//     chats: ID!
//     banned: [ID!]
//   }

//   type participant {
//     _id: ID!
//     name: String!
//     avatar: String
//     rank: Int!
//     score: Int!
//     tasks: [participantTasks!]
//   }

//   type participantTasks {
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

//   type participant {
//     _id: ID!
//     name: String!
//     avatar: String
//     score: Int!
//     tasks: [participantTasks!]
//   }

//   type participantTasks {
//     num: Int!
//     opt: String
//   }

//   type Alert {
//     message: String!
//     time: String!
//   }
