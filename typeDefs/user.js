import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getUser: UserProfile!
  }

  extend type Mutation {
    editProfile(input: editProfileInput): Boolean!
    loginWithSocial(input: LoginWithSocialInput): LoginResponse!
  }

  #TYPES=========================================================================
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
    _id: String!
    name: String
    email: String
    sid: String
    providerId: String
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

  type LoginResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User!
    token: String!
  }

  #INPUT=========================================================================
  input editProfileInput {
    name: String
    avatar: String
    about: String
  }

  input LoginWithSocialInput {
    email: String
    name: String
    providerId: String!
    sid: String!
  }
`;

// type User {
//   name: String!
//   banner: String!
//   pts: Int!
//   contests: [Contest!]
//   notify: Int!
//   globalNotify: Int!
//   closed: [ID!]
//   open: [ID!]
//   joined: [HostedTag!]
//   hosted: [HostedTag!]
//   closedCount: Int
//   openCount: Int!
//   gold: Int
//   silver: Int
//   bronze: Int
//   catz: Categories!
// }
