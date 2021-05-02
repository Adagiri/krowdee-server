import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    fetchUser: User!
  }

  extend type Mutation {
    editProfile(input: editProfileInput): Boolean!
  }

  input editProfileInput {
    name: String
    avatar: String
    about: String
  }

  type User {
    name: String!
    avatar: String!
    pts: Int!
    contests: [Contest!]
    notifications: [Notification!]
    waiting: [ID!]
    closed: [ID!]
    hosted: [ID!]
    participated: [ID!]
    gold: Int
    silver: Int
    bronze: Int
    catz: Categories!
  }

  type Categories {
    art: Int
    prog: Int
    csc: Int
    maths: Int
    history: Int
    english: Int
    geography: Int
    finance: Int
    science: Int
    tech: Int
    variants: Int
  }

  type Notification {
    message: String!
    extra: Extra!
    seen: Boolean!
  }

  type Extra {
    message: String
    ref: ID
  }
`;
