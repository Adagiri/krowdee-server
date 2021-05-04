import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    joinPrivate(input: joinPrivateInput): Boolean!
    joinGlobal(input: joinGlobalInput): Boolean!
    leaveContest(input: leaveContestInput): Boolean!
    kickOut(input: kickOutInput): Boolean!
    sendAnnouncement(input: sendAnnouncementInput): Boolean!
    toggleDiscussion(input: toggleDiscussionInput): Boolean!
  }

  input joinPrivateInput {
    pin: Int!
    name: String!
    avatar: String
  }

  input joinGlobalInput {
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
  }
`;

// report contest
// starting contest
// view notifications
// alertContestStartsIn_minutes
// onquery of hosted, participated, waiting - reset the arrays
