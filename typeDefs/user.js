import { gql } from "apollo-server-express";

//github, facebook, twitter & google signups & logout
// ___ krowdee/auth/github =====> 

export default gql`
  extend type Query {
  fetchUser: User!
  }

  extend type Mutation {
    join: [User!]
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
    won: Int
    medals: [medal!]
    contests: [Contest!]
    hosted: [ID!]

  }

  type medal {
    _id: ID!
    type: String
  }
`;
