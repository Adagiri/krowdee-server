import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    hostClosedSearchPin(input: hostClosedSearchPinInput): Boolean!
    hostClosed(input: hostClosedInput): Boolean!
    hostOpen(input: hostOpenInput): Boolean!
    refreshHost(input: refreshHostInput): Boolean!
    unHost(input: unHostInput): Boolean!
  }

  input hostClosedInput {
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

  input hostOpenInput {
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

  input hostClosedSearchPinInput {
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
