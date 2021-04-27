import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSignedUrl(input: getSignedUrlInput): String!
    leaderboard(input)
    chat: Chat!
  }

  extend type Mutation {
    sendMessage(input: sendMessageInput): Boolean!
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
