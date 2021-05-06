import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSignedUrl(input: getSignedUrlInput): String!
    getNotifications: [Notification]!
  }

  extend type Mutation {
    mute: Boolean!
  }

  input getSignedUrlInput {
    key: String!
  }

  type Notification {
    message: String!
    ref: ID!
    to: [ID!]
    date: String!
  }
`;
