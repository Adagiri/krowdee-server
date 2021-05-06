import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getUser: UserProfile!
  }

  extend type Mutation {
    editProfile(input: editProfileInput): Boolean!
  }

  input editProfileInput {
    name: String
    avatar: String
    about: String
  }
  type UserProfile {
    name: String!
    avatar: String!
    pts: Int!
    contests: [Contest!]
    notify: Int!
    globalNotify: Int!
    closed: [ID!]
    open: [ID!]
    joined: [HostedTag!]
    hosted: [HostedTag!]
    closedCount: Int
    openCount: Int!
    gold: Int
    silver: Int
    bronze: Int
    catz: Categories!
  }

  type User {
    name: String!
    avatar: String!
    pts: Int!
    contests: [Contest!]
    notify: Int!
    globalNotify: Int!
    closed: [ID!]
    open: [ID!]
    joined: [HostedTag!]
    hosted: [HostedTag!]
    closedCount: Int
    openCount: Int!
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

  type HostedTag {
    _id: ID!
    type: String!
  }
`;
