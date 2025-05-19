import { Octokit } from 'octokit';
import type { GraphQLResponse } from '@apollo/server';

import type { Repository } from '../generated/prisma';
import { GraphQLAbstractType } from 'graphql';

const { graphql: octokit } = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getRepository(owner: string, name: string) {
  const result = await octokit<{
    repository: {
      description: string | null;
    };
  }>(
    `
          query getRepository($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              description
            }
          }
        `,
    {
      owner,
      name,
    }
  );

  return result.repository;
}

async function getAllRepositoryLatestReleases(repositories: Repository[]) {
  if (repositories.length === 0) {
    return [];
  }

  const query = `
  query {
    ${repositories
      .map(
        ({ id, owner, name }, i) => `
          ${id}: repository(owner: "${owner}", name: "${name}") {
            latestRelease {
              tagName
              publishedAt
              descriptionHTML
            }
          }
        `
      )
      .join('\n')}
  }
`;

  const result = await octokit(query);

  return result;
}

export { getRepository, getAllRepositoryLatestReleases };
