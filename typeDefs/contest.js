import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    addTask(input: addTaskInput): Boolean!
    editTask(input: editTaskInput): Boolean!
    deleteTask(input: deleteTaskInput): Boolean!
    deleteContest(input: deleteContestInput): Boolean!
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
