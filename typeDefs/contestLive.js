import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getDiscussions(input: getDiscussionsInput): Discuss!
    getOpenContests(input: getOpenContestsInput): [HostedContestExcerpt!]
    getRecords(input: getRecordsInput): [HostedContestExcerpt]
    getContest(input: getContestInput): HostedContest!
    getCorrections(input: getCorrectionsInput): HostedContestWithValids!
  }

  extend type Mutation {
    sendMessage(input: sendMessageInput): Boolean!
    solveTask(input: solveTaskInput): NextTask!
    startContest(input: startContestInput): NextTask!
    endContest(input: endContestInput): HostedContestWithValids!
  }

  input getDiscussionsInput {
    _id: ID!
  }

  input sendMessageInput {
    _id: ID!
    message: String!
    name: String!
    type: String!
  }

  input solveTaskInput {
    _id: ID!
    num: Int!
    valid: String
    userId: ID!
  }

  input getOpenContestsInput {
    category: String
    ranked: Boolean
  }

  input getContestInput {
    _id: ID!
    type: String!
  }

  input startContestInput {
    _id: ID!
    type: String!
  }

  input getRecordsInput {
    closed: [ID!]
    open: [ID!]
  }

  input getCorrectionsInput {
    _id: ID!
    type: String!
  }

  input endContestInput {
    _id: ID!
    type: String!
  }

  type Discuss {
    discussion: Discussion
    pageInfo: PageInfo
  }

  type PageInfo {
    nextPageCursor: String
    hasNextPage: Boolean!
  }

  type NextTask {
    userValid: String
    valid: String
    next: LiveTask
  }

  type Discussion {
    contestId: ID!
    start: String!
    messages: [DiscussionMessage!]
  }

  type DiscussionMessage {
    message: String!
    date: String!
    name: String!
    _id: ID!
    admin: Boolean
  }

  type HostedContest {
    _id: ID!
    host: ID!
    ranked: Boolean
    discussion: Boolean!
    announcements: [Announcement!]
    name: String!
    summary: String
    banner: String
    category: String
    tags: [String!]
    mode: String!
    time: Int
    tasks: [LiveTask!]!
    totalTasks: Int!
    limit: Int!
    joined: Int!
    start: String!
    end: String
    participants: [Participant!]
    banned: [ID!]
  }

  type HostedContestExcerpt {
    _id: ID!
    ranked: Boolean
    name: String!
    category: String
    mode: String!
    time: Int
    totalTasks: Int!
    joined: Int!
    start: String!
  }

  type HostedContestWithValids {
    _id: ID!
    host: ID!
    ranked: Boolean
    discussion: Boolean!
    announcements: [Announcement!]
    name: String!
    summary: String
    banner: String
    category: String
    tags: [String!]
    mode: String!
    time: Int
    tasks: [LiveTask!]!
    totalTasks: Int!
    limit: Int!
    joined: Int!
    start: String!
    end: String
    participants: [Participant!]
    banned: [ID!]
    valids: [LiveValids]
  }

  type LiveTask {
    num: Int!
    text: String!
    banner: String
    opts: [Option!]!
    time: Int
  }

  type LiveValids {
    i: Int!
    v: String
  }

  type Announcement {
    message: String!
    time: String!
  }

  type Participant {
    _id: ID!
    name: String!
    avatar: String
    score: Int!
    tasks: [ParticipantTasks!]
  }

  type ParticipantTasks {
    num: Int!
    opt: String
  }
`;

//contestEnded
