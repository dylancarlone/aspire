import database from '../helpers/database';
import {
  getAllRepositoryLatestReleases,
  getRepository,
} from '../helpers/github';

const typeDefs = `#graphql
  type Repository {
    id: String!
    name: String!
    owner: String!
    description: String
    latestReleaseTag: String
    latestReleaseDate: String
    latestReleaseNotes: String
    seenAt: String
  }

  type Query {
    repositories: [Repository]
    repository(id: String!): Repository
  }

  type Mutation {
    addRepository(url: String!): Repository
    setRepositoryLatestReleaseSeen(id: String!): Repository
    updateRepositoryLatestReleases: Boolean
    resetRepositoryLatestReleases: Boolean
  }
`;

const resolvers = {
  Query: {
    repositories: async () => {
      const repositories = await database.repository.findMany({
        orderBy: {
          latestReleaseDate: {
            sort: 'desc',
            nulls: 'last',
          },
        },
      });

      return repositories;
    },
    repository: async (_parent: undefined, { id }: { id: string }) => {
      const repository = await database.repository.findUnique({
        where: {
          id,
        },
      });

      if (!repository) {
        throw new Error('Repository not found');
      }

      return repository;
    },
  },
  Mutation: {
    addRepository: async (_parent: undefined, { url }: { url: string }) => {
      const urlParts = url.split('/');
      const owner = urlParts[urlParts.length - 2];
      const name = urlParts[urlParts.length - 1];

      const existingRepository = await database.repository.findFirst({
        where: {
          owner,
          name,
        },
      });

      if (existingRepository) {
        console.log(
          'Repository already exists in the database:',
          existingRepository
        );

        return existingRepository;
      }

      try {
        const githubRepository = await getRepository(owner, name);
        const newRepository = await database.repository.create({
          data: {
            owner,
            name,
            description: githubRepository.description,
          },
        });

        return newRepository;
      } catch (error) {
        if (error instanceof Error)
          throw new Error('Error fetching repository from GitHub');
      }
    },
    setRepositoryLatestReleaseSeen: async (
      _parent: undefined,
      { id }: { id: string }
    ) => {
      const repository = await database.repository.findUnique({
        where: {
          id,
        },
      });

      if (!repository) {
        throw new Error('Repository not found');
      }

      return database.repository.update({
        where: {
          id,
        },
        data: {
          seenAt: new Date(),
        },
      });
    },
    updateRepositoryLatestReleases: async () => {
      const repositories = await database.repository.findMany();

      try {
        const latestReleases = await getAllRepositoryLatestReleases(
          repositories
        );

        await Promise.all(
          Object.entries(latestReleases as Record<string, any>)
            .filter(
              ([_id, { latestRelease }]: any) =>
                latestRelease !== null && latestRelease.tagName !== null
            )
            .map(async ([id, { latestRelease }]: any) => {
              const repository = repositories.find((repo) => repo.id === id);
              const { tagName, publishedAt, descriptionHTML } = latestRelease;

              if (!repository) {
                throw new Error('Unable to match latest release to repository');
              }

              return database.repository.update({
                where: {
                  id,
                },
                data: {
                  latestReleaseTag: tagName,
                  latestReleaseDate: new Date(publishedAt),
                  latestReleaseNotes: descriptionHTML,
                  // Reset seenAt if only there is a new release
                  ...(tagName !== repository.latestReleaseTag && {
                    seenAt: null,
                  }),
                },
              });
            })
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'Error fetching latest releases from GitHub:',
            error.message
          );
        }
      }

      return true;
    },
    resetRepositoryLatestReleases: async () => {
      const repositories = await database.repository.findMany();

      await Promise.all(
        repositories.map((repository) =>
          database.repository.update({
            where: {
              id: repository.id,
            },
            data: {
              latestReleaseTag: null,
              latestReleaseDate: null,
              latestReleaseNotes: null,
              seenAt: null,
            },
          })
        )
      );

      return true;
    },
  },
};

export { typeDefs, resolvers };
