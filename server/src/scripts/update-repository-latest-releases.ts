import { resolvers } from '../helpers/graphql';

async function updateRepositoryLatestReleases() {
  console.log('Updating repository latest releases...');
  await resolvers.Mutation.updateRepositoryLatestReleases();
  console.log('Updated repository latest releases');
}

updateRepositoryLatestReleases();
