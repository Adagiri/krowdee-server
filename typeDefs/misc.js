import { gql } from "apollo-server-express";


export default gql`
  extend type Query {
    getSignedUrl(input: getSignedUrlInput): String!
    chat: Chat!
  }

  extend type Mutation {
    sendMessage(input: sendMessageInput): Boolean!
    solveTask(input: solveTaskInput): TaskResult!
  }


  type TaskResult {
    userValid: String!
    valid: String!
}

  input solveTaskInput {
    _id: ID!
    num: Int!
    valid: String
    userId: ID!
  }

  type Chat {
    contestId: ID!
    start: String!
    messages: [ChatMessage!]
  }

  type ChatMessage {
    message: String!
    time: String!
    name: String!
    _id: ID!
  }

  input sendMessageInput {
    _id: ID!
    message: String!
    name: String!
}

  input getSignedUrlInput {
    key: String!
  }
`;
