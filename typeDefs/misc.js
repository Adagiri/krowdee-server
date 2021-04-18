import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSignedUrl(input: getSignedUrlInput): String!
  }

  input getSignedUrlInput {
    key: String!
  }
`;
