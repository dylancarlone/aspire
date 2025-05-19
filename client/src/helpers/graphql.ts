import { gql } from '@apollo/client';

// Quick type definition for the repository object, in production would use something like graphql-code-generator to keep types aligned with the server
type Repository = {
  id: string;
  owner: string;
  name: string;
  description: string | null;
  latestReleaseTag: string | null;
  latestReleaseDate: string | null;
  latestReleaseNotes: string | null;
  seenAt: string | null;
  createdAt: string;
};

const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      id
      owner
      name
      description
      latestReleaseTag
      latestReleaseDate
      latestReleaseNotes
      seenAt
    }
  }
`;

const GET_REPOSITORY = gql`
  query GetRepository($id: String!) {
    repository(id: $id) {
      id
      owner
      name
      description
      latestReleaseTag
      latestReleaseDate
      latestReleaseNotes
      seenAt
    }
  }
`;

const ADD_REPOSITORY = gql`
  mutation AddRepository($url: String!) {
    addRepository(url: $url) {
      id
      owner
      name
      description
    }
  }
`;

const SET_REPOSITORY_LATEST_RELEASE_SEEN = gql`
  mutation SetRepositoryLatestReleaseSeen($id: String!) {
    setRepositoryLatestReleaseSeen(id: $id) {
      id
    }
  }
`;

const UPDATE_REPOSITORY_LATEST_RELEASES = gql`
  mutation UpdateLatestReleases {
    updateRepositoryLatestReleases
  }
`;

const RESET_REPOSITORY_LATEST_RELEASES = gql`
  mutation ResetLatestReleases {
    resetRepositoryLatestReleases
  }
`;

export {
  GET_REPOSITORIES,
  GET_REPOSITORY,
  ADD_REPOSITORY,
  UPDATE_REPOSITORY_LATEST_RELEASES,
  SET_REPOSITORY_LATEST_RELEASE_SEEN,
  RESET_REPOSITORY_LATEST_RELEASES,
};

export type { Repository };
