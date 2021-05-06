import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    joinClosed(input: joinClosedInput): Boolean!
    joinOpen(input: joinOpenInput): Boolean!
    leaveContest(input: leaveContestInput): Boolean!
    kickOut(input: kickOutInput): Boolean!
    sendAnnouncement(input: sendAnnouncementInput): Boolean!
    toggleDiscussion(input: toggleDiscussionInput): Boolean!
  }

  input joinClosedInput {
    pin: Int!
    name: String!
    avatar: String
  }

  input joinOpenInput {
    _id: ID!
    name: String!
    avatar: String
  }
  input leaveContestInput {
    _id: ID!
    type: String!
  }

  input kickOutInput {
    type: String!
    _id: ID!
    participantId: ID!
    reason: String
    contestName: String!
  }

  input sendAnnouncementInput {
    _id: ID!
    message: String!
    type: String!
  }

  input toggleDiscussionInput {
    type: String!
    _id: ID!
    name: String
  }
`;

// onquery of hosted, participated, waiting - reset the arrays